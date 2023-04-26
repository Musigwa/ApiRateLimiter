// The sliding window algorithm for rate limiting and both soft and hard throttling measures.
export const slidingWindowLimiter = async (req, res, next) => {
  const clientId = req.headers['x-client-id'];
  const delayMs = 500;
  const intervalSeconds = 60;
  const maxRequestsPerMinute = 100;
  try {
    const { isRateLimited, resetTime } = await checkRateLimit(clientId, maxRequestsPerMinute, intervalSeconds);
    if (isRateLimited) {
      const delayUntilReset = resetTime * 1000 - Date.now();
      res.set('Retry-After', delayUntilReset);
      return res.status(429).json({ message: 'Too Many Requests' });
    } else setTimeout(next, delayMs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
