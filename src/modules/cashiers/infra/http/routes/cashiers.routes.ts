import { Router } from 'express';

import ensureAuthentication from '@shared/infra/http/middlewares/ensureAuthentication';

import CashiersController from '../controllers/CashiersController';

const cashiersRouter = Router();
const cashiersController = new CashiersController();

cashiersRouter.post('/', ensureAuthentication, cashiersController.store);
cashiersRouter.get('/', ensureAuthentication, cashiersController.index);

export default cashiersRouter;
