import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';
import sessionRouter from '@modules/users/infra/http/routes/sessions.routes';
import profilesRouter from '@modules/users/infra/http/routes/profiles.routes';

const routes = Router();

routes.use('/users', usersRouter);
routes.use('/sessions', sessionRouter);

routes.use('/profiles', profilesRouter);

export default routes;
