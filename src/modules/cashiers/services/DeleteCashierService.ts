import { injectable, inject } from 'tsyringe';

import AppError from '@shared/error/AppError';
import ICashiersRepository from '../repositories/ICashiersRepository';

interface IRequestDTO {
  cashier_id: string;
  user_id: string;
}

@injectable()
export default class DeleteCashierService {
  constructor(
    @inject('CashiersRepository')
    private cashiersRepository: ICashiersRepository
  ) {}

  public async run({ cashier_id, user_id }: IRequestDTO): Promise<void> {
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
        message: "You can't delete another user's cashier.",
      });
    }

    await this.cashiersRepository.destroy(cashier);
  }
}
