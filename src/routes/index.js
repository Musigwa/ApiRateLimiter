import { Router } from 'express';
import multer from "multer";
import { notFoundHandler, requestTimeout, unknownErrorHandler } from './error';
import serviceRouter from "./service";
import userRouter from "./user";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const appRouter = Router();

// Api request timeout handler
appRouter.use(requestTimeout);
// The reset of the api routes
appRouter.use('/users', upload.single('file'), userRouter);
appRouter.use('/services', serviceRouter);

// Handle 404 errors
appRouter.use(notFoundHandler);
// Handle all other errors
appRouter.use(unknownErrorHandler);


export default appRouter;