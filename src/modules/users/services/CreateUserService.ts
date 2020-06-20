import { injectable, inject } from 'tsyringe';
import { User } from '@prisma/client';

import AppError from '@shared/error/AppError';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async run({ name, email, password }: IRequestDTO): Promise<User> {
    const emailAlreadyInUse = await this.usersRepository.findByEmail({ email });

    if (emailAlreadyInUse) {
      throw new AppError({
        status: 400,
        message: 'Email already in use.',
      });
    }

    const hashedPassword = await this.hashProvider.generateHash({
      payload: password,
    });

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}
