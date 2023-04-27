// Handle 404 errors
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({ message: '404: Page not found' });
};

// Set a timeout of 30 seconds for all requests
export const requestTimeout = (req, res, next) => {
  const { REQ_INTERVAL_SECS = 30000 } = process.env;

  req.setTimeout(parseInt(REQ_INTERVAL_SECS), () => {
    const error = new Error('Request Timeout');
    error.status = 408;
    next(error);
  });
  next();
};

// Handle all other unhandled errors
export const unknownErrorHandler = (error, req, res, next) => {
  console.error(error);
  if (error.status === 408)
    return res.status(408).json({ message: 'Request Timeout' });
  next(err);
  const { message = '500: Internal server error', status = 500 } = error;
  return res.status(status).json({ message });
};
