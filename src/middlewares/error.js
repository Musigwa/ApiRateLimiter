const errorMsg = { serverError: '500: Internal server error' };

// Handle 404 errors
export const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: '404: Page not found' });
};

// Set a timeout of 30 seconds for all requests
export const requestTimeout = (req, res, next) => {
  try {
    const { API_RESPONSE_TIMEOUT = 2000 } = process.env;
    next();
    const error = new Error(
      'Your request took longer to execute! Please try again'
    );
    error.status = 408;
    const timeoutHandler = () => {
      res.status(408).json({
        error: 'Your request took longer to execute! Please try again',
      });
    };
    const timeoutId = setTimeout(timeoutHandler, API_RESPONSE_TIMEOUT);
    res.on('finish', () => clearTimeout(timeoutId));
  } catch (error) {
    next(error);
  }
};

// Handle all other unhandled errors
// eslint-disable-next-line no-unused-vars
export const unknownErrorHandler = (error, req, res, next) => {
  try {
    const { message: error = errorMsg.serverError, status = 500 } = error;
    console.log('error', error.message);
    return res.status(status).json({ error });
  } catch ({ message = errorMsg.serverError }) {
    return res.status(error.status ?? 500).json({ error: error.message });
  }
};
