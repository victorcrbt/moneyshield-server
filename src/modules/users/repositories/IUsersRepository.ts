import { User } from '@prisma/client';

import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IFindUserByEmailDTO from '../dtos/IFindUserByEmailDTO';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<User>;
  findByEmail(data: IFindUserByEmailDTO): Promise<User | null>;
}
