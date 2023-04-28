// Handle 404 errors
export const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: '404: Page not found' });
};

// Set a timeout of 30 seconds for all requests
export const requestTimeout = (req, res, next) => {
  const { API_RESPONSE_TIMEOUT = 2000 } = process.env;
  next();
  const error = new Error(
    'Your request took longer to execute! Please try again'
  );
  error.status = 408;
  const timeoutHandler = () => next(error);
  const timeoutId = setTimeout(timeoutHandler, API_RESPONSE_TIMEOUT);
  res.on('finish', () => clearTimeout(timeoutId));
};

// Handle all other unhandled errors
// eslint-disable-next-line no-unused-vars
export const unknownErrorHandler = (error, req, res, next) => {
  const { message = '500: Internal server error', status = 500 } = error;
  console.log('error', error.message);
  return res.status(status).json({ message });
};
