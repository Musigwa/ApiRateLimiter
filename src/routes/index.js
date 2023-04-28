import { Router } from 'express';
import multer from 'multer';
import { fixedWindowLimiter } from '../middlewares';
import {
  notFoundHandler,
  requestTimeout,
  unknownErrorHandler,
} from '../middlewares/error';
import serviceRouter from './service';
import userRouter from './user';
import { checkAuth } from '../middlewares/auth';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const appRouter = Router();

// Api request timeout handler
appRouter.use(requestTimeout);
// The reset of the api routes
appRouter.use('/users', upload.single('file'), userRouter);
appRouter.use('/services', checkAuth, fixedWindowLimiter, serviceRouter);

// Handle 404 errors
appRouter.use(notFoundHandler);
// Handle all other errors
appRouter.use(unknownErrorHandler);

export default appRouter;
