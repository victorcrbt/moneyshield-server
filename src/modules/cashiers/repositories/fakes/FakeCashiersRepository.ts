import { Cashier } from '@prisma/client';
import { uuid } from 'uuidv4';
import _ from 'lodash';

import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository';

import ICreateCashierDTO from '@modules/cashiers/dtos/ICreateCashierDTO';
import IFindCashierByUserIDDTO from '@modules/cashiers/dtos/IFindCashierByUserIDDTO';
import IFindByIDDTO from '@modules/cashiers/dtos/IFindByIDDTO';

export default class FakeCashiersRepository implements ICashiersRepository {
  private cashiersRepository: Cashier[] = [];

  public async create({
    user_id,
    name,
    is_bank_account = false,
    bank_name = null,
    bank_branch = null,
    bank_account = null,
    account_type = null,
    balance = 0,
  }: ICreateCashierDTO): Promise<Cashier> {
    const cashier = {
      id: uuid(),
      user_id,
      name,
      is_bank_account,
      bank_name,
      bank_branch,
      bank_account,
      account_type,
      balance,
    };

    this.cashiersRepository.push(cashier);

    return cashier;
  }

  public async findByID({ cashier_id }: IFindByIDDTO): Promise<Cashier | null> {
    const foundCashier = this.cashiersRepository.find(
      cashier => cashier.id === cashier_id
    );

    if (!foundCashier) return null;

    return foundCashier;
  }

  public async findByUserID({
    user_id,
    sorting,
  }: IFindCashierByUserIDDTO): Promise<Cashier[]> {
    const cashiers = this.cashiersRepository.filter(
      cashier => cashier.user_id === user_id
    );

    let sortedCashiers = _.sortBy(cashiers, sorting?.field || 'id');

    if (sorting?.order === 'desc') {
      sortedCashiers = _.reverse(sortedCashiers);
    }

    return sortedCashiers;
  }

  public async findAll(): Promise<Cashier[]> {
    return this.cashiersRepository;
  }
}
