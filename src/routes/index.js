import { Router } from 'express';
import multer from 'multer';
import {
  notFoundHandler,
  timeoutHandler,
  otherErrorsHandler,
  fixedWindowRateLimiter,
  prometheusMonitor,
} from '../middlewares';
import serviceRouter from './service';
import authRouter from './auth';

const storage = multer.memoryStorage();
const upload = multer({ storage });
const appRouter = Router();

// Api request monitor, timeout, rate limit handlers
appRouter.use(prometheusMonitor, fixedWindowRateLimiter, timeoutHandler);
// The reset of the api routes
appRouter.use('/auth', upload.single('file'), authRouter);
appRouter.use('/services', serviceRouter);

// Handle 404 errors and all other errors
appRouter.use(notFoundHandler);
appRouter.use(otherErrorsHandler);

export default appRouter;
