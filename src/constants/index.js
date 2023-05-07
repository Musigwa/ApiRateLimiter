import { StatusCodes } from 'http-status-codes';

const {
  REQUEST_TIMEOUT,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  NOT_FOUND,
  BAD_REQUEST,
  CONFLICT,
  CREATED,
  OK,
} = StatusCodes;

export const errorMessage = {
  [REQUEST_TIMEOUT]: 'Your request took longer to execute! Please try again',
  [INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [UNAUTHORIZED]: 'Invalid or Expired access data provided!',
  [NOT_FOUND]: 'The requested URL does not refer to a valid resource.',
  [BAD_REQUEST]: 'Request validation failed!',
  REDIS_CONNECT_ERROR: 'Unable to connect to Redis',
  [CONFLICT]: (model = 'Entity') =>
    `${model} with one or more details already exists`,
};

export const successMessage = {
  [CREATED]: (model = 'User') => `${model} created successfully`,
  [OK]: (action = 'updated', model = 'User') =>
    `${model} ${action} successfully`,
};
