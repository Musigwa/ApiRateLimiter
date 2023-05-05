import { StatusCodes } from 'http-status-codes';

const { REQUEST_TIMEOUT, INTERNAL_SERVER_ERROR } = StatusCodes;

export const errorMessage = {
  [REQUEST_TIMEOUT]: 'Your request took longer to execute! Please try again',
  [INTERNAL_SERVER_ERROR]: 'Internal Server Error',
};
