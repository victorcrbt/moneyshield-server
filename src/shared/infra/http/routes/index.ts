import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => res.send('Hello, Worlds!'));

export default routes;
