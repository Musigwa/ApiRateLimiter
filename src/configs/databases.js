import Redis from 'ioredis';
import mongoose from 'mongoose';

const { MONGO_DB_URI } = process.env;
const dbOptions = { maxPoolSize: 10, autoCreate: true };

export const redisClient = new Redis({ enableOfflineQueue: true });
export const dbConnection = () => mongoose.connect(MONGO_DB_URI, dbOptions);

export const resetRedis = async () => {
  try {
    const done = await redisClient.flushall();
    console.log(`Redis reset: ${done}`);
  } catch (error) {
    console.log(`RedisError: ${error}`);
  }
};

export const closeDbConnection = async () => {
  try {
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.log('Closing MongoDB connection failed!', error);
  } finally {
    process.exit(process.exitCode ?? 0);
  }
};
