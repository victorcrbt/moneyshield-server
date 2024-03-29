import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import profilesRouter from '@modules/users/infra/http/routes/profiles.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';

import cashiersRouter from '@modules/cashiers/infra/http/routes/cashiers.routes';

import financialMovementsRouter from '@modules/financial_movements/infra/http/routes/financialMovements.routes';
import paymentStatusRouter from '@modules/financial_movements/infra/http/routes/paymentStatus.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionRouter);
routes.use('/passwords', passwordRouter);
routes.use('/profiles', profilesRouter);

routes.use('/cashiers', cashiersRouter);

routes.use('/financial_movements', financialMovementsRouter);
routes.use('/payment_status', paymentStatusRouter);

export default routes;
