import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis();

const { MAX_REQ_PER_INTERVAL = 10, REQ_INTERVAL_SECS = 60 } = process.env;
const maxRequestsPerInterval = parseInt(MAX_REQ_PER_INTERVAL); // Maximum requests allowed per interval
const intervalSeconds = parseInt(REQ_INTERVAL_SECS); // Interval duration in seconds

// Initialize the rate limiter for hard throttle
const rateLimiter = (options = {}) =>
  new RateLimiterRedis({
    ...options,
    storeClient: redisClient,
    points: maxRequestsPerInterval,
    duration: intervalSeconds,
  });

const errorMsg = {
  missingData: (name = 'x-client-id', category = 'headers') =>
    `The ${name} is missing in the request ${category}`,
};

// Middleware function for throttling (Fixed window)
export const fixedWindowMiddleware = async (req, res, next) => {
  try {
    const clientId = req.headers['x-client-id'];
    if (clientId) {
      const hardOptions = { keyPrefix: 'hard', blockDuration: intervalSeconds };
      await rateLimiter(hardOptions).consume(clientId);
      await rateLimiter({ keyPrefix: 'soft' }).consume(clientId);
      next();
    } else return res.status(400).json({ message: errorMsg.missingData() });
  } catch (error) {
    console.log('error', error);
    const retryAfterSeconds = Math.ceil(error.msBeforeNext / 1000);
    res.status(429).json({
      message: `Too many requests, please try again in ${retryAfterSeconds} seconds`,
    });
  }
};
