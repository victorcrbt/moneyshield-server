import { PrismaClient, User } from '@prisma/client';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindUserByIDDTO from '@modules/users/dtos/IFindUserByIDDTO';
import IFindUserByEmailDTO from '@modules/users/dtos/IFindUserByEmailDTO';

export default class UsersRepository implements IUsersRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUsersDTO): Promise<User> {
    const user = await this.client.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }

  public async findByID({ user_id }: IFindUserByIDDTO): Promise<User | null> {
    const user = await this.client.user.findOne({
      where: {
        id: user_id,
      },
    });

    return user;
  }

  public async findByEmail({
    email,
  }: IFindUserByEmailDTO): Promise<User | null> {
    const user = await this.client.user.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  public async save(user: User): Promise<User> {
    await this.client.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    return user;
  }
}
