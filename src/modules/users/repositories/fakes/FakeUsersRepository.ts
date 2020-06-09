import { User } from '@prisma/client';
import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import ICreateUsersDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindUserByEmailDTO from '@modules/users/dtos/IFindUserByEmailDTO';

export default class UsersRepository implements IUsersRepository {
  private usersRepository: User[] = [];

  public async create({
    name,
    email,
    password,
  }: ICreateUsersDTO): Promise<User> {
    const user: User = {
      id: uuid(),
      name,
      email,
      password,
      created_at: new Date(),
      updated_at: new Date(),
    };

    this.usersRepository.push(user);

    return user;
  }

  public async findByEmail({
    email,
  }: IFindUserByEmailDTO): Promise<User | null> {
    const foundUser = this.usersRepository.find((user) => user.email === email);

    if (!foundUser) return null;

    return foundUser;
  }
}
