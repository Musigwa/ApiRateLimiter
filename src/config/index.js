import { createClient } from 'redis';
import RedisClient from 'ioredis';

export const redisClient = createClient();
export const ioredisClient = new RedisClient();
