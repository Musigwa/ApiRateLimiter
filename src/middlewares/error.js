const errorMsg = { serverError: '500: Internal server error' };

// Handle 404 errors
export const notFoundHandler = (req, res) => {
  return res.status(404).json({ message: '404: Page not found' });
};

// Set a timeout of 30 seconds for all requests
export const timeoutHandler = (req, res, next) => {
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
export const otherErrorsHandler = (err, req, res, next) => {
  console.error(err.stack);
  const { message = errorMsg.serverError, status = 500 } = err;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((error) => {
      return { message: error.message, field: error.path };
    });
    return res.status(400).json({ message: 'Validation error', errors });
  }

  // Handle Joi validation errors
  if (err.name === 'ValidationError') {
    const errors = err.details.map((detail) => ({
      message: detail.message,
      field: detail.path,
    }));
    return res.status(400).json({ message: 'Validation error', errors });
  }

  // Handle Redis errors
  if (err.code === 'ECONNREFUSED')
    return res.status(500).json({ message: 'Unable to connect to Redis' });

  // Handle syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err)
    return res.status(400).json({ message: 'Invalid JSON payload' });

  // Handle type errors
  if (err instanceof TypeError)
    return res.status(400).json({ message: 'Type error' });

  // Handle reference errors
  if (err instanceof ReferenceError)
    return res.status(400).json({ message: 'Reference error' });

  // Handle range errors
  if (err instanceof RangeError)
    return res.status(400).json({ message: 'Range error' });

  // Handle "not found" errors
  if (err.status === 404)
    return res.status(404).json({ message: 'Route not found' });

  // Handle other errors
  return res.status(status).json({ message });
};
