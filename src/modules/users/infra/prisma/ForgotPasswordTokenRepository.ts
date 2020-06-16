import { PrismaClient, ForgotPasswordToken } from '@prisma/client';
import { uuid } from 'uuidv4';

import IForgotPasswordTokenRepository from '@modules/users/repositories/IForgotPasswordTokenRepository';
import ICreateForgotPasswordTokenDTO from '@modules/users/dtos/ICreateForgotPasswordTokenDTO';
import IFindTokenByContentDTO from '@modules/users/dtos/IFindTokenByContentDTO';

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

  public async findByContent({
    content,
  }: IFindTokenByContentDTO): Promise<ForgotPasswordToken | null> {
    const token = await this.client.forgotPasswordToken.findOne({
      where: {
        content,
      },
    });

    return token;
  }

  public async destroy(token: ForgotPasswordToken): Promise<void> {
    await this.client.forgotPasswordToken.delete({
      where: {
        id: token.id,
      },
    });
  }
}
