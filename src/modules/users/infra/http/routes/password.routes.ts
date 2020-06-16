import { Router } from 'express';

import ForgotPasswordController from '../controllers/ForgotPasswordController';
import ResetPasswordToken from '../controllers/ResetPasswordToken';

const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordToken();

passwordRouter.post('/forgot', forgotPasswordController.store);
passwordRouter.post('/reset', resetPasswordController.store);

export default passwordRouter;
