import { Cashier } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import ICashiersRepository from '../repositories/ICashiersRepository';

interface IRequestDTO {
  user_id: string;
  name: string;
  is_bank_account?: boolean;
  bank_name?: string | null;
  bank_branch?: string | null;
  bank_account?: string | null;
  account_type?: 'savings' | 'checking' | 'not_applied' | null;
}

@injectable()
export default class CreateCashierService {
  constructor(
    @inject('CashiersRepository')
    private cashiersRepository: ICashiersRepository
  ) {}

  public async run({
    user_id,
    name,
    is_bank_account = false,
    bank_name = null,
    bank_branch = null,
    bank_account = null,
    account_type = null,
  }: IRequestDTO): Promise<Cashier> {
    const cashier = await this.cashiersRepository.create({
      user_id,
      name,
      is_bank_account,
      bank_name,
      bank_branch,
      bank_account,
      account_type,
    });

    return cashier;
  }
}
