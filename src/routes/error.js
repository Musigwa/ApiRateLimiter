// Handle 404 errors
export const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: '404: Page not found' });
};

// Set a timeout of 30 seconds for all requests
export const requestTimeout = (req, res, next) => {
  const { API_RESPONSE_TIMEOUT = 2000 } = process.env;
  const error = { message: 'Request Timeout! Please try again', status: 408 };
  const timeoutHandler = () => next(error);
  const timeoutId = setTimeout(timeoutHandler, API_RESPONSE_TIMEOUT);
  res.on('finish', () => clearTimeout(timeoutId));
  next();
};

// Handle all other unhandled errors
// eslint-disable-next-line no-unused-vars
export const unknownErrorHandler = (error, req, res, next) => {
  const { message = '500: Internal server error', status = 500 } = error;
  return res.status(status).json({ message });
};
