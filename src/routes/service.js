import { Router } from 'express';
import { serviceController } from '../controllers';


const serviceRouter = Router();

serviceRouter.post('/sms', serviceController.handleSendSMS);

serviceRouter.post('/email', serviceController.handleSendEmail);

export default serviceRouter;