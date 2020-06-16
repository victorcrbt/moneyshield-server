import { PrismaClient, ForgotPasswordToken } from '@prisma/client';
import { uuid } from 'uuidv4';

import IForgotPasswordTokenRepository from '@modules/users/repositories/IForgotPasswordTokenRepository';
import ICreateForgotPasswordTokenDTO from '@modules/users/dtos/ICreateForgotPasswordTokenDTO';

export default class ForgotPasswordTokenRepository
  implements IForgotPasswordTokenRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  public async create({
    client_id,
  }: ICreateForgotPasswordTokenDTO): Promise<ForgotPasswordToken> {
    const token = await this.client.forgotPasswordToken.create({
      data: {
        content: uuid(),
        user: {
          connect: {
            id: client_id,
          },
        },
      },
    });

    return token;
  }
}
