import { Router } from 'express';
import { authController } from '../controllers';

const userRouter = Router();

// Dummy endpoint for signup requests
userRouter.post('/signup', authController.createAccount);

// Dummy endpoint for login requests
userRouter.post('/login', authController.userLogin);

export default userRouter;
