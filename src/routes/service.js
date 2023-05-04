import { Router } from 'express';
import { serviceController } from 'controllers';
import { checkAuth, fixedWindowLimiter, prometheusMonitor } from 'middlewares';

const serviceRouter = Router();

serviceRouter.use(checkAuth, fixedWindowLimiter, prometheusMonitor);
serviceRouter.post('/sms', serviceController.handleSendSMS);
serviceRouter.post('/email', serviceController.handleSendEmail);

export default serviceRouter;
