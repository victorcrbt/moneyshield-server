import { injectable, inject } from 'tsyringe';
import { User } from '@prisma/client';

import AppError from '@shared/error/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  user_id: string;
  profile_data: {
    name: string;
    email: string;
    old_password?: string;
    password?: string;
  };
}

@injectable()
export default class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async run({
    user_id,
    profile_data: { name, email, old_password, password },
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findByID({ user_id });

    if (!user) {
      throw new AppError({
        status: 404,
        message: 'User not found.',
      });
    }

    const emailAlreadyInUse = await this.usersRepository.findByEmail({ email });

    if (emailAlreadyInUse && emailAlreadyInUse.id !== user.id) {
      throw new AppError({
        status: 400,
        message: 'Email already in use.',
      });
    }

    if (password) {
      if (!old_password) {
        throw new AppError({
          status: 400,
          message:
            'To update your password, you must provide your old password.',
        });
      }

      const passwordMatches = await this.hashProvider.compareHash({
        payload: old_password,
        hash: user.password,
      });

      if (!passwordMatches) {
        throw new AppError({
          status: 401,
          message: 'Incorrect old password.',
        });
      }

      const hashedPassword = await this.hashProvider.generateHash({
        payload: password,
      });

      user.password = hashedPassword;
    }

    Object.assign(user, {
      name,
      email,
    });

    await this.usersRepository.save(user);

    return user;
  }
}
