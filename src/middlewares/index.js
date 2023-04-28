import { RateLimiterRedis } from 'rate-limiter-flexible';
import { dbConnection, redisClient } from '../configs/databases';

const {
  MAX_REQ_PER_INTERVAL = 10,
  INTERVAL_SECONDS = 30,
  SOFT_INTERVAL_SECS = 15,
} = process.env;

const maxRequestsPerInterval = parseInt(MAX_REQ_PER_INTERVAL); // Maximum requests allowed per interval
const intervalSeconds = parseInt(INTERVAL_SECONDS); // Interval duration in seconds
const softThrottleIntervalSeconds = parseInt(SOFT_INTERVAL_SECS); // Soft throttle interval duration in seconds
const softThrottlePoints = Math.floor(maxRequestsPerInterval / 2); // Points for soft throttle rate limiter

// initialize the rate limiter for hard throttle
const hardThrottleLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'hard',
  points: maxRequestsPerInterval,
  duration: intervalSeconds,
  blockDuration: intervalSeconds, // block for the entire interval after limit is reached
});

// initialize the rate limiter for soft throttle
const softThrottleLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'soft',
  points: softThrottlePoints,
  duration: softThrottleIntervalSeconds,
});

const errorMsg = {
  missingData: (name = 'x-client-id', category = 'headers') =>
    `The ${name} is missing in the request ${category}`,
};

// Set up the MongoDB connection
export const connectDB = async (req, res, next) => {
  try {
    if (dbConnection.readyState === 1) {
      console.log('Already connected to MongoDB!');
      next();
    } else {
      dbConnection.once('open', () => next());
    }
  } catch (error) {
    res.status(503).json({ error: 'Service Unavailable' });
    console.error('Failed to connect to MongoDB', error);
  }
};

// Middleware function for throttling (Fixed window)
export const fixedWindowMiddleware = async (req, res, next) => {
  const clientId = req.headers['x-client-id'];
  try {
    if (clientId) {
      const { remainingPoints, msBeforeNext } =
        await softThrottleLimiter.consume(clientId, 1);
      if (remainingPoints <= 0) {
        const retryAfterSeconds = Math.ceil(msBeforeNext / 1000);
        return res.status(429).json({
          error: `Too many requests, please try again in ${retryAfterSeconds} seconds`,
        });
      } else next();
    } else return res.status(400).json({ error: errorMsg.missingData() });
  } catch (softError) {
    try {
      // Fallback to hard throttle if there is an error with soft throttle
      await hardThrottleLimiter.consume(clientId);
      next();
    } catch (hardError) {
      const headers = {
        'Retry-After': hardError.msBeforeNext / 1000,
        'X-RateLimit-Limit': hardThrottleLimiter.points,
        'X-RateLimit-Remaining': hardError.remainingPoints,
        'X-RateLimit-Reset': new Date(
          Date.now() + hardError.msBeforeNext
        ).toISOString(),
      };
      res.set(headers);
      const retryAfterSeconds = Math.ceil(hardError.msBeforeNext / 1000);
      return res.status(429).json({
        error: `Too many requests, please try again in ${retryAfterSeconds} seconds`,
      });
    }
  }
};
