import { Router } from 'express';

import ensureAuthentication from '@shared/infra/http/middlewares/ensureAuthentication';

import PaymentStatusController from '../controllers/PaymentStatusController';

const paymentStatusRouter = Router();
const paymentStatusController = new PaymentStatusController();

paymentStatusRouter.patch(
  '/:financial_movement_id/toggle',
  ensureAuthentication,
  paymentStatusController.update
);

export default paymentStatusRouter;
