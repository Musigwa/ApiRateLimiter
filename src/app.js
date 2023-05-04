import express from 'express';
import { connectMongo, connectRedis } from 'middlewares';
import appRouter from 'routes';

const app = express();

app.use(express.json(), express.urlencoded({ extended: true }));
app.use(connectRedis, connectMongo, appRouter);

export default app;
