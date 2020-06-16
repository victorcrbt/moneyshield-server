import { injectable, inject } from 'tsyringe';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';

import authConfig from '@config/auth';

import AppError from '@shared/error/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  email: string;
  password: string;
}

interface IResponseDTO {
  token: string;
  user: User;
}

@injectable()
export default class CreateSessionService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async run({ email, password }: IRequestDTO): Promise<IResponseDTO> {
    const user = await this.usersRepository.findByEmail({ email });

    if (!user) {
      throw new AppError({
        status: 401,
        message: 'Invalid credentials.',
      });
    }

    const passwordMatches = await this.hashProvider.compareHash({
      payload: password,
      hash: user.password,
    });

    if (!passwordMatches) {
      throw new AppError({
        status: 401,
        message: 'Invalid credentials.',
      });
    }

    const token = jwt.sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: '1d',
    });

    return { token, user };
  }
}
