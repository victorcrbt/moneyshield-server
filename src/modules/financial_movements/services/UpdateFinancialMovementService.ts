import { injectable, inject } from 'tsyringe';
import { FinancialMovement } from '@prisma/client';

import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository';

import AppError from '@shared/error/AppError';
import IFinancialMovementsRepository from '../repositories/IFinancialMovementsRepository';

interface IRequestDTO {
  user_id: string;
  financial_movement_id: string;
  cashier_id: string;
  description?: string;
  type?: 'income' | 'outcome';
  due_date?: Date;
}

@injectable()
export default class UpdateFinancialMovementService {
  constructor(
    @inject('FinancialMovementsRepository')
    private financialMovementsRepository: IFinancialMovementsRepository,

    @inject('CashiersRepository')
    private cashiersRepository: ICashiersRepository
  ) {}

  public async run({
    user_id,
    financial_movement_id,
    cashier_id,
    description,
    type,
    due_date,
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

    const sourceCashier = await this.cashiersRepository.findByID({
      cashier_id: financialMovement.cashier_id,
    });

    const targetCashier = await this.cashiersRepository.findByID({
      cashier_id,
    });

    if (!sourceCashier) {
      throw new AppError({
        status: 404,
        message: 'Source cashier not found.',
      });
    }

    if (!targetCashier) {
      throw new AppError({
        status: 404,
        message: 'Target cashier not found.',
      });
    }

    if (targetCashier.user_id !== user_id) {
      throw new AppError({
        status: 403,
        message:
          "You cannot include a financial movement on another user's cashier.",
      });
    }

    /**
     * Change the cashier balance based on if the type of the financial movement was changed and tha status was paid out.
     */
    if (
      type &&
      type !== financialMovement.type &&
      financialMovement.status === 'paid_out'
    ) {
      switch (type) {
        case 'income': {
          const newBalance =
            sourceCashier.balance + financialMovement.value * 2;

          sourceCashier.balance = newBalance;

          await this.cashiersRepository.save(sourceCashier);

          break;
        }

        default: {
          const newBalance =
            sourceCashier.balance - financialMovement.value * 2;

          sourceCashier.balance = newBalance;

          await this.cashiersRepository.save(sourceCashier);

          break;
        }
      }
    }

    /**
     * Adjust the balance of both the source and target cashier if the on is changed an the status was paid out.
     */
    if (
      cashier_id !== financialMovement.cashier_id &&
      financialMovement.status === 'paid_out'
    ) {
      if (financialMovement.type === 'income') {
        const newSourceCashierBalance =
          type === 'outcome'
            ? sourceCashier.balance + financialMovement.value
            : sourceCashier.balance - financialMovement.value;

        const newTargetCashierBalance =
          type === 'outcome'
            ? targetCashier.balance - financialMovement.value
            : targetCashier.balance + financialMovement.value;

        sourceCashier.balance = newSourceCashierBalance;
        targetCashier.balance = newTargetCashierBalance;

        await this.cashiersRepository.save(sourceCashier);
        await this.cashiersRepository.save(targetCashier);
      } else if (financialMovement.type === 'outcome') {
        const newSourceCashierBalance =
          type === 'income'
            ? sourceCashier.balance - financialMovement.value
            : sourceCashier.balance + financialMovement.value;

        const newTargetCashierBalance =
          type === 'income'
            ? targetCashier.balance + financialMovement.value
            : targetCashier.balance - financialMovement.value;

        sourceCashier.balance = newSourceCashierBalance;
        targetCashier.balance = newTargetCashierBalance;

        await this.cashiersRepository.save(sourceCashier);
        await this.cashiersRepository.save(targetCashier);
      }
    }

    Object.assign(financialMovement, {
      cashier_id,
      description,
      type,
      due_date,
    });

    await this.financialMovementsRepository.save(financialMovement);

    return financialMovement;
  }
}
