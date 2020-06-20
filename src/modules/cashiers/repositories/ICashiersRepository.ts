import { Cashier } from '@prisma/client';

import ICreateCashierDTO from '../dtos/ICreateCashierDTO';
import IFindCashierByUserIDDTO from '../dtos/IFindCashierByUserIDDTO';
import IFindByIDDTO from '../dtos/IFindByIDDTO';

export default interface ICashiersRepository {
  create(data: ICreateCashierDTO): Promise<Cashier>;
  findByID(data: IFindByIDDTO): Promise<Cashier | null>;
  findByUserID(data: IFindCashierByUserIDDTO): Promise<Cashier[]>;
  destroy(cashier: Cashier): Promise<void>;
}
