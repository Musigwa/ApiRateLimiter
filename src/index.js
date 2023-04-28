import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './documentation';
import appRouter from './routes';
import { connectMongo, connectRedis } from './middlewares';
import { closeDbConnection } from './configs/databases';
import { requestTimeout } from './middlewares/error';

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(connectRedis, connectMongo, requestTimeout, appRouter);

// Handle some necessary operations before the server shutdown
process.on('SIGINT', closeDbConnection);

const { SERVER_PORT = 3000 } = process.env;

app.listen(SERVER_PORT, () => {
  console.log(`Server started on port: ${SERVER_PORT}`);
});
