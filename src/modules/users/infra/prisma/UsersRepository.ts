import { PrismaClient, User } from '@prisma/client';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';
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
}
