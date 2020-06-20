import { Router } from 'express';

import ensureAuthentication from '@shared/infra/http/middlewares/ensureAuthentication';

import ProfileController from '../controllers/ProfileController';

const profilesRouter = Router();
const profileController = new ProfileController();

profilesRouter.put('/', ensureAuthentication, profileController.update);

export default profilesRouter;
