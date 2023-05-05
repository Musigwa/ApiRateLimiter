import { serviceController } from 'controllers';
import { Router } from 'express';
import { checkAuth, prometheusMonitor } from 'middlewares';

const serviceRouter = Router();

serviceRouter.use(checkAuth, prometheusMonitor);
serviceRouter.post('/sms', serviceController.handleSendSMS);
serviceRouter.post('/email', serviceController.handleSendEmail);

export default serviceRouter;
