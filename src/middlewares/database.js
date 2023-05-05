import { mongoConnection, redisClient } from 'configs/databases';
import mongoose from 'mongoose';

export { fixedWindowRateLimiter, prometheusMonitor } from './service';
export { timeoutHandler, errorHandler, notFoundHandler } from './error';
export { checkAuth, userLogout } from './auth';

const { MONGO_DB_URI } = process.env;
const dbOptions = { maxPoolSize: 10, autoCreate: true };

const mongoConnectionErrorHandler = (error) => {
  console.log('Error connecting to the database:', error.message);
  error.status = 503;
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
    res.status(503).json({ error: 'Service Unavailable' });
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
    res.status(503).json({ error: 'Service Unavailable' });
    console.error('Failed to connect to Redis', error);
  }
};
