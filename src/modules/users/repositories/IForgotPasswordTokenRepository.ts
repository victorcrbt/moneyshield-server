import { ForgotPasswordToken } from '@prisma/client';

import ICreateForgotPasswordTokenDTO from '../dtos/ICreateForgotPasswordTokenDTO';

export default interface IForgotPasswordTokenRepository {
  create(data: ICreateForgotPasswordTokenDTO): Promise<ForgotPasswordToken>;
}
