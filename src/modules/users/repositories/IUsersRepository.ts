import { User } from '@prisma/client';

import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindUserByIDDTO from '../dtos/IFindUserByIDDTO';
import IFindUserByEmailDTO from '../dtos/IFindUserByEmailDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByID(data: IFindUserByIDDTO): Promise<User | null>;
  findByEmail(data: IFindUserByEmailDTO): Promise<User | null>;
  save(user: User): Promise<User>;
}
