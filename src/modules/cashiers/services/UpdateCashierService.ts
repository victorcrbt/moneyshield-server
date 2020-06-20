import { Cashier } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/error/AppError';
import ICashiersRepository from '../repositories/ICashiersRepository';

interface IRequestDTO {
  cashier_id: string;
  user_id: string;
  cashier_data?: {
    name?: string;
    account_type?: 'savings' | 'checking' | 'not_applied' | null;
  };
}

@injectable()
export default class UpdateCashierService {
  constructor(
    @inject('CashiersRepository')
    private cashiersRepository: ICashiersRepository
  ) {}

  public async run({
    cashier_id,
    user_id,
    cashier_data,
  }: IRequestDTO): Promise<Cashier> {
    const cashier = await this.cashiersRepository.findByID({ cashier_id });

    if (!cashier) {
      throw new AppError({
        status: 404,
        message: 'Cashier not found.',
      });
    }

    if (cashier.user_id !== user_id) {
      throw new AppError({
        status: 403,
        message: "You can't update another user's cashier.",
      });
    }

    Object.assign(cashier, cashier_data);

    await this.cashiersRepository.save(cashier);

    return cashier;
  }
}
