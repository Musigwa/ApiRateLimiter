import Redis from 'ioredis';
import mongoose from 'mongoose';

export const redisClient = new Redis({
  enableOfflineQueue: true,
  lazyConnect: true,
});

export const dbConnection = mongoose.connection;

export const closeDbConnection = async () => {
  console.log('Shutting down server...');
  try {
    await redisClient.quit();
    await dbConnection.close();
    console.log('All DB connections are closed.');
  } catch (error) {
    console.log('Closing DB connections failed!', error);
  } finally {
    process.exit(process.exitCode ?? 0);
  }
};
