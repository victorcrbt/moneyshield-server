import { injectable, inject } from 'tsyringe';
import { addDays, isAfter } from 'date-fns';

import AppError from '@shared/error/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import IUsersRepository from '../repositories/IUsersRepository';
import IForgotPasswordTokenRepository from '../repositories/IForgotPasswordTokenRepository';

interface IRequestDTO {
  token: string;
  password: string;
}

@injectable()
export default class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ForgotPasswordTokenRepository')
    private forgotPasswordTokenRepository: IForgotPasswordTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async run({ token, password }: IRequestDTO): Promise<void> {
    const tokenExists = await this.forgotPasswordTokenRepository.findByContent({
      content: token,
    });

    if (!tokenExists) {
      throw new AppError({
        status: 404,
        message: 'Token not found.',
      });
    }

    const tokenExpiration = addDays(tokenExists.created_at, 1);
    const tokenIsExpired = isAfter(Date.now(), tokenExpiration);

    if (tokenIsExpired) {
      throw new AppError({
        status: 403,
        message: 'The provided token is expired.',
      });
    }

    const user = await this.usersRepository.findByID({
      user_id: tokenExists.user_id,
    });

    if (!user) {
      throw new AppError({
        status: 404,
        message: 'User not found.',
      });
    }

    const hashedPassword = await this.hashProvider.generateHash({
      payload: password,
    });

    Object.assign(user, {
      password: hashedPassword,
    });

    await this.usersRepository.save(user);

    await this.forgotPasswordTokenRepository.destroy(tokenExists);
  }
}
