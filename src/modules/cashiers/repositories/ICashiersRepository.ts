import { Cashier } from '@prisma/client';

import ICreateCashierDTO from '../dtos/ICreateCashierDTO';
import IFindCashierByUserIDDTO from '../dtos/IFindCashierByUserIDDTO';

export default interface ICashiersRepository {
  create(data: ICreateCashierDTO): Promise<Cashier>;
  findByUserID(data: IFindCashierByUserIDDTO): Promise<Cashier[]>;
}
