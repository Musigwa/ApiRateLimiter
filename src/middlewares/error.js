import { StatusCodes } from 'http-status-codes';
import { errorMessage } from '@constants';
const {
  UNAUTHORIZED,
  BAD_REQUEST,
  REQUEST_TIMEOUT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
} = StatusCodes;

// Handle NOT_FOUND errors
export const notFoundHandler = (req, res) => {
  return res.status(NOT_FOUND).json({ error: errorMessage[NOT_FOUND] });
};

// Set a timeout of 30 seconds for all requests
export const timeoutHandler = (req, res, next) => {
  try {
    const { API_RESPONSE_TIMEOUT = 2000 } = process.env;
    next();
    const error = new Error(errorMessage[REQUEST_TIMEOUT]);
    error.status = REQUEST_TIMEOUT;
    const timeoutHandler = () => {
      throw error;
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
  const {
    message = errorMessage[INTERNAL_SERVER_ERROR],
    status = INTERNAL_SERVER_ERROR,
  } = err;

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError' && err.errors) {
    const errors = Object.values(err.errors).map((error) => {
      return { error: error.message, field: error.path };
    });
    return res.status(BAD_REQUEST).json({
      error: errorMessage[BAD_REQUEST],
      errors,
    });
  }

  // Handle Joi validation errors
  if (err.name === 'ValidationError') {
    const errors = err.details.map((detail) => ({
      error: detail.message,
      field: detail.path,
    }));
    return res.status(BAD_REQUEST).json({
      error: errorMessage[BAD_REQUEST],
      errors,
    });
  }

  // Handle JWT errors
  if (err.name === 'TokenExpiredError')
    return res.status(UNAUTHORIZED).json({ error: errorMessage[UNAUTHORIZED] });

  // Handle Redis errors
  if (err.code === 'ECONNREFUSED')
    return res.status(INTERNAL_SERVER_ERROR).json({
      error: errorMessage.REDIS_CONNECT_ERROR,
    });

  // Handle syntax errors
  if (err instanceof SyntaxError && err.status === BAD_REQUEST && 'body' in err)
    return res.status(UNAUTHORIZED).json({
      error: err.message ?? 'Invalid JSON payload',
    });

  // Handle type errors
  if (err instanceof TypeError)
    return res.status(BAD_REQUEST).json({
      error: err.message ?? 'Type error',
    });

  // Handle reference errors
  if (err instanceof ReferenceError)
    return res.status(BAD_REQUEST).json({
      error: err.message ?? 'Reference error',
    });

  // Handle range errors
  if (err instanceof RangeError)
    return res.status(BAD_REQUEST).json({
      error: err.message ?? 'Range error',
    });

  // Handle "not found" errors
  if (err.status === NOT_FOUND)
    return res.status(NOT_FOUND).json({ error: errorMessage[NOT_FOUND] });

  // Handle other errors
  return res.status(status).json({ error: message });
};
