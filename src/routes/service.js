import { serviceController } from 'controllers';
import { Router } from 'express';
import { checkAuth, checkInvalidated } from 'middlewares';

const serviceRouter = Router();

// Put all unsecured routes here before checkAuth is called
// .......................................................
// Secure endpoints
serviceRouter.use(checkInvalidated, checkAuth);
serviceRouter.post('/sms', serviceController.handleSendSMS);
serviceRouter.post('/email', serviceController.handleSendEmail);

export default serviceRouter;
