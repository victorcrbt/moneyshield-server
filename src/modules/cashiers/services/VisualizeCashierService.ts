import { Cashier } from '@prisma/client';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/error/AppError';
import ICashiersRepository from '../repositories/ICashiersRepository';

interface IRequestDTO {
  user_id: string;
  cashier_id: string;
}

@injectable()
export default class VisualizeCashierService {
  constructor(
    @inject('CashiersRepository')
    private cashiersRepository: ICashiersRepository
  ) {}

  public async run({ user_id, cashier_id }: IRequestDTO): Promise<Cashier> {
    const cashier = await this.cashiersRepository.findByID({
      cashier_id,
    });

    if (!cashier) {
      throw new AppError({
        status: 404,
        message: 'Cashier not found.',
      });
    }

    if (cashier.user_id !== user_id) {
      throw new AppError({
        status: 403,
        message: "You can't visualize another client's cashier.",
      });
    }

    return cashier;
  }
}
