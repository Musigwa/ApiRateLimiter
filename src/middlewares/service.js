import Prometheus from 'prom-client';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redisClient } from 'configs/databases';
import { StatusCodes } from 'http-status-codes';

const { TOO_MANY_REQUESTS, BAD_REQUEST } = StatusCodes;

const {
  MAX_REQ_PER_INTERVAL = 10,
  HARD_INTERVAL_SECS = 30,
  SOFT_INTERVAL_SECS = 15,
} = process.env;

const maxRequestsPerInterval = parseInt(MAX_REQ_PER_INTERVAL); // Maximum requests allowed per interval
const intervalSeconds = parseInt(HARD_INTERVAL_SECS); // Interval duration in seconds
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

const httpRequestDurationMicroseconds = new Prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'statusCode'],
  buckets: [0.1, 0.5, 1, 5, 10, 30, 60, 120, 300],
});

export const prometheusMonitor = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const end = Date.now();
    const elapsed = end - start;
    httpRequestDurationMicroseconds
      .labels(req.method, req.path, res.statusCode)
      .observe(elapsed / 1000);
  });
  next();
};

// Middleware function for throttling (Fixed window)
export const fixedWindowRateLimiter = async (req, res, next) => {
  // Extract the the clientId (since the authentication middleware sets it) or the their IP address
  const clientId = req.clientId ?? req.ip;
  try {
    if (clientId) {
      const { remainingPoints, msBeforeNext } =
        await softThrottleLimiter.consume(clientId, 1);
      if (remainingPoints <= 0) {
        const retryAfterSeconds = Math.ceil(msBeforeNext / 1000);
        return res.status(TOO_MANY_REQUESTS).json({
          error: `Too many requests, please try again in ${retryAfterSeconds} seconds`,
        });
      } else next();
    } else
      return res.status(BAD_REQUEST).json({ error: errorMsg.missingData() });
  } catch (softError) {
    try {
      // Fallback to hard throttle if there is an error with soft throttle
      await hardThrottleLimiter.consume(clientId);
      next();
    } catch (hardError) {
      console.log('hardError', hardError);
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
      hardError.status = TOO_MANY_REQUESTS;
      hardError.message = `Too many requests, please try again in ${retryAfterSeconds} seconds`;
      next(hardError);
    }
  }
};
