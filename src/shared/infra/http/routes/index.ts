import { Router } from 'express';

import usersRouter from '@modules/users/infra/http/routes/users.routes';

const routes = Router();

routes.use(usersRouter);

routes.get('/', (req, res) => res.send('Hello, Worlds!'));

export default routes;
