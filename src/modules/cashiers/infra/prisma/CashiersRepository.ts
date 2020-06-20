import { Cashier, PrismaClient } from '@prisma/client';
import { uuid } from 'uuidv4';

import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository';

import ICreateCashierDTO from '@modules/cashiers/dtos/ICreateCashierDTO';
import IFindCashierByUserIDDTO from '@modules/cashiers/dtos/IFindCashierByUserIDDTO';
import IFindByIDDTO from '@modules/cashiers/dtos/IFindByIDDTO';

export default class FakeCashiersRepository implements ICashiersRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  public async create({
    user_id,
    name,
    is_bank_account = false,
    bank_name = null,
    bank_branch = null,
    bank_account = null,
    account_type = null,
  }: ICreateCashierDTO): Promise<Cashier> {
    const cashier = await this.client.cashier.create({
      data: {
        id: uuid(),
        user: {
          connect: {
            id: user_id,
          },
        },
        name,
        is_bank_account,
        bank_name,
        bank_branch,
        bank_account,
        account_type,
        balance: 0,
      },
    });

    return cashier;
  }

  public async findByID({ cashier_id }: IFindByIDDTO): Promise<Cashier | null> {
    const cashier = await this.client.cashier.findOne({
      where: {
        id: cashier_id,
      },
    });

    return cashier;
  }

  public async findByUserID({
    user_id,
    sorting,
  }: IFindCashierByUserIDDTO): Promise<Cashier[]> {
    const cashiers = await this.client.cashier.findMany({
      where: {
        user_id,
      },
      orderBy: {
        [sorting?.field || 'id']: sorting?.order || 'asc',
      },
    });

    return cashiers;
  }

  public async destroy(cashier: Cashier): Promise<void> {
    await this.client.cashier.delete({
      where: {
        id: cashier.id,
      },
    });
  }
}
