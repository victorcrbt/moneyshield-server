import { injectable, inject } from 'tsyringe';
import { FinancialMovement } from '@prisma/client';

import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository';

import AppError from '@shared/error/AppError';
import IFinancialMovementsRepository from '../repositories/IFinancialMovementsRepository';

interface IRequestDTO {
  user_id: string;
  financial_movement_id: string;
}

@injectable()
export default class CreateFinancialMovementService {
  constructor(
    @inject('FinancialMovementsRepository')
    private financialMovementsRepository: IFinancialMovementsRepository,

    @inject('CashiersRepository')
    private cashiersRepository: ICashiersRepository
  ) {}

  public async run({
    user_id,
    financial_movement_id,
  }: IRequestDTO): Promise<void> {
    const financialMovement = await this.financialMovementsRepository.findByID({
      financial_movement_id,
    });

    if (!financialMovement) {
      throw new AppError({
        status: 404,
        message: 'Financial movement not found.',
      });
    }

    if (financialMovement.user_id !== user_id) {
      throw new AppError({
        status: 403,
        message: 'You can only delete your own financial movements.',
      });
    }

    if (financialMovement.status === 'paid_out') {
      const cashier = await this.cashiersRepository.findByID({
        cashier_id: financialMovement.cashier_id,
      });

      if (!cashier) {
        throw new AppError({
          status: 404,
          message: 'Cashier not found.',
        });
      }

      const newBalance =
        financialMovement.type === 'income'
          ? cashier.balance - financialMovement.value
          : cashier.balance + financialMovement.value;

      cashier.balance = newBalance;

      await this.cashiersRepository.save(cashier);
    }

    await this.financialMovementsRepository.destroy(financialMovement);
  }
}
