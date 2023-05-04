import { Router } from 'express';
import multer from 'multer';
import {
  notFoundHandler,
  requestTimeout,
  unknownErrorHandler,
} from 'middlewares';
import serviceRouter from './service';
import authRouter from './auth';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const appRouter = Router();

// Api request timeout handler
appRouter.use(requestTimeout);
// The reset of the api routes
appRouter.use('/auth', upload.single('file'), authRouter);

appRouter.use('/services', serviceRouter);
// Handle 404 errors
appRouter.use(notFoundHandler);
// Handle all other errors
appRouter.use(unknownErrorHandler);

export default appRouter;
