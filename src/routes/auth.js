import { Router } from 'express';
import { authController } from 'controllers';
import { userLogout, checkAuth, checkInvalidated } from 'middlewares';

const authRouter = Router();

// Put all unsecured routes here before checkAuth is called
authRouter.post('/signup', authController.createAccount);
authRouter.post('/login', authController.userLogin);
// Secure endpoints
authRouter.use(checkInvalidated, checkAuth);
authRouter.delete('/logout', userLogout);

export default authRouter;
