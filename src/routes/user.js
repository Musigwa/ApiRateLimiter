import { Router } from 'express';
import { userController } from '../controllers';

const userRouter = Router();

// Dummy endpoint for signup requests
userRouter.post('/signup', userController.createAccount);

// Dummy endpoint for login requests
userRouter.post('/login', userController.userLogin);

export default userRouter;
