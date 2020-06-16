import { ForgotPasswordToken } from '@prisma/client';

import ICreateForgotPasswordTokenDTO from '../dtos/ICreateForgotPasswordTokenDTO';
import IFindTokenByContentDTO from '../dtos/IFindTokenByContentDTO';

export default interface IForgotPasswordTokenRepository {
  create(data: ICreateForgotPasswordTokenDTO): Promise<ForgotPasswordToken>;
  findByContent(
    data: IFindTokenByContentDTO
  ): Promise<ForgotPasswordToken | null>;
  destroy(token: ForgotPasswordToken): Promise<void>;
}
