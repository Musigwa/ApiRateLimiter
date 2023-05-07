import { mongoConnection, redisClient } from 'configs/databases';
import mongoose from 'mongoose';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export { fixedWindowRateLimiter, prometheusMonitor } from './service';
export { timeoutHandler, errorHandler, notFoundHandler } from './error';
export { checkAuth, userLogout } from './auth';

const { MONGO_DB_URI } = process.env;
const dbOptions = { maxPoolSize: 10, autoCreate: true };
const { SERVICE_UNAVAILABLE } = StatusCodes;

const mongoConnectionErrorHandler = (error) => {
  console.log('Error connecting to the database:', error.message);
  error.status = SERVICE_UNAVAILABLE;
  throw error;
};
// Set up the MongoDB connection
export const connectMongo = async (req, res, next) => {
  try {
    if (mongoConnection.readyState === 1) {
      console.log('Already connected to MongoDB!');
      next();
    } else {
      mongoose
        .connect(MONGO_DB_URI, dbOptions)
        .then(() => next())
        .catch(mongoConnectionErrorHandler);
    }
  } catch (error) {
    error.status = SERVICE_UNAVAILABLE;
    error.message = ReasonPhrases.SERVICE_UNAVAILABLE;
    next(error);
    console.error('Failed to connect to MongoDB', error);
  }
};

// Set up the Redis connection
export const connectRedis = async (req, res, next) => {
  try {
    if (redisClient.status === 'ready') {
      console.log('Already connected to Redis!');
      next();
    } else {
      redisClient
        .connect()
        .then(() => next())
        .catch(mongoConnectionErrorHandler);
    }
  } catch (error) {
    error.status = SERVICE_UNAVAILABLE;
    error.message = ReasonPhrases.SERVICE_UNAVAILABLE;
    next(error);
    console.error('Failed to connect to Redis', error);
  }
};
