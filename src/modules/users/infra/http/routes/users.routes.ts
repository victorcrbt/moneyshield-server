import { Router } from 'express';

const usersRouter = Router();

usersRouter.get('/users', (req, res) => res.send('Users'));

export default usersRouter;
