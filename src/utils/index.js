const softLimitStore = {};
const hardLimitStore = {};

export const hardThrottle = (clientId, maxRequests, intervalSeconds) => {
  const now = Math.floor(Date.now() / 1000);
  const key = `client:${clientId}`;
  const intervalStart = now - intervalSeconds;

  const count = (hardLimitStore[key] || []).filter(
    (time) => time > intervalStart
  ).length;
  if (count >= maxRequests) {
    throw new Error('Rate limit exceeded');
  }
  hardLimitStore[key] = [...(hardLimitStore[key] || []), now];
};

export const softThrottle = (clientId, maxRequests, intervalSeconds) => {
  const now = Math.floor(Date.now() / 1000);
  const key = `client:${clientId}`;
  const intervalStart = now - intervalSeconds;

  const count = (softLimitStore[key] || []).filter(
    (time) => time > intervalStart
  ).length;
  if (count >= maxRequests) {
    const retryAfter = softLimitStore[key][0] + intervalSeconds - now;
    return retryAfter;
  }
  softLimitStore[key] = [...(softLimitStore[key] || []), now];
};
