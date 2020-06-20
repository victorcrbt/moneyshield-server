import { Router } from 'express';

import ensureAuthentication from '@shared/infra/http/middlewares/ensureAuthentication';

import CashiersController from '../controllers/CashiersController';

const cashiersRouter = Router();
const cashiersController = new CashiersController();

cashiersRouter.post('/', ensureAuthentication, cashiersController.store);
cashiersRouter.get('/', ensureAuthentication, cashiersController.index);

cashiersRouter.get(
  '/:cashier_id',
  ensureAuthentication,
  cashiersController.show
);

cashiersRouter.put(
  '/:cashier_id',
  ensureAuthentication,
  cashiersController.update
);

cashiersRouter.delete(
  '/:cashier_id',
  ensureAuthentication,
  cashiersController.destroy
);

export default cashiersRouter;
