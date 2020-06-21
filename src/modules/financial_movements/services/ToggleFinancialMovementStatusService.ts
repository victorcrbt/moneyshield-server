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
export default class ToggleFinancialMovementStatus {
  constructor(
    @inject('FinancialMovementsRepository')
    private financialMovementsRepository: IFinancialMovementsRepository,

    @inject('CashiersRepository')
    private cashiersRepository: ICashiersRepository
  ) {}

  public async run({
    user_id,
    financial_movement_id,
  }: IRequestDTO): Promise<FinancialMovement> {
    const financialMovement = await this.financialMovementsRepository.findByID({
      financial_movement_id,
    });

    if (!financialMovement) {
      throw new AppError({
        status: 404,
        message: 'Financial movement not found.',
      });
    }

    const cashier = await this.cashiersRepository.findByID({
      cashier_id: financialMovement.cashier_id,
    });

    if (!cashier) {
      throw new AppError({
        status: 404,
        message: 'Cashier not found for this movement.',
      });
    }

    if (cashier.user_id !== user_id) {
      throw new AppError({
        status: 403,
        message: "You cannot change the status of another user's movement.",
      });
    }

    financialMovement.status =
      financialMovement.status === 'paid_out' ? 'pending' : 'paid_out';

    const { status, type } = financialMovement;

    switch (type) {
      case 'income': {
        if (status === 'paid_out') {
          const newBalance = cashier.balance + financialMovement.value;

          cashier.balance = newBalance;

          await this.cashiersRepository.save(cashier);

          break;
        } else {
          const newBalance = cashier.balance - financialMovement.value;

          cashier.balance = newBalance;

          await this.cashiersRepository.save(cashier);

          break;
        }
      }
      default: {
        if (status === 'paid_out') {
          const newBalance = cashier.balance - financialMovement.value;

          cashier.balance = newBalance;

          await this.cashiersRepository.save(cashier);

          break;
        } else {
          const newBalance = cashier.balance + financialMovement.value;

          cashier.balance = newBalance;

          await this.cashiersRepository.save(cashier);

          break;
        }
      }
    }

    await this.financialMovementsRepository.save(financialMovement);

    return financialMovement;
  }
}
