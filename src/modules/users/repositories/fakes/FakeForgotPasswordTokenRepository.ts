import { ForgotPasswordToken } from '@prisma/client';
import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IForgotPasswordTokenRepository';

import ICreateForgotPasswordTokenDTO from '@modules/users/dtos/ICreateForgotPasswordTokenDTO';
import IFindTokenByContentDTO from '@modules/users/dtos/IFindTokenByContentDTO';

export default class UsersRepository implements IUsersRepository {
  private tokensRepository: ForgotPasswordToken[] = [];

  public async create({
    client_id,
  }: ICreateForgotPasswordTokenDTO): Promise<ForgotPasswordToken> {
    const token: ForgotPasswordToken = {
      id: uuid(),
      content: uuid(),
      user_id: client_id,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    };

    this.tokensRepository.push(token);

    return token;
  }

  public async findByContent({
    content,
  }: IFindTokenByContentDTO): Promise<ForgotPasswordToken | null> {
    const foundToken = this.tokensRepository.find(
      token => token.content === content
    );

    if (!foundToken) return null;

    return foundToken;
  }

  public async destroy(token: ForgotPasswordToken): Promise<void> {
    const tokenIndex = this.tokensRepository.findIndex(
      repoToken => repoToken.id === token.id
    );

    this.tokensRepository.splice(tokenIndex, 1);
  }
}
