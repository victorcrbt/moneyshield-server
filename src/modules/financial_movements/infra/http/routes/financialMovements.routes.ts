import { Router } from 'express';

import ensureAuthentication from '@shared/infra/http/middlewares/ensureAuthentication';

import FinancialMovementsController from '../controllers/FinancialMovementsController';

const financialMovementsRouter = Router();
const financialMovementsController = new FinancialMovementsController();

financialMovementsRouter.post(
  '/',
  ensureAuthentication,
  financialMovementsController.store
);

financialMovementsRouter.get(
  '/',
  ensureAuthentication,
  financialMovementsController.index
);

financialMovementsRouter.get(
  '/:financial_movement_id',
  ensureAuthentication,
  financialMovementsController.show
);

financialMovementsRouter.put(
  '/:financial_movement_id',
  ensureAuthentication,
  financialMovementsController.update
);

export default financialMovementsRouter;
