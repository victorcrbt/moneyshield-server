import { injectable, inject } from 'tsyringe';
import { FinancialMovement } from '@prisma/client';

import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository';

import AppError from '@shared/error/AppError';
import IFinancialMovementsRepository from '../repositories/IFinancialMovementsRepository';

interface IRequestDTO {
  user_id: string;
  cashier_id: string;
  description: string;
  type: 'income' | 'outcome';
  due_date: Date;
  value: number;
  status?: 'pending' | 'paid_out';
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
    cashier_id,
    description,
    type,
    due_date,
    value,
    status,
  }: IRequestDTO): Promise<FinancialMovement> {
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
        message:
          "You cannot include a financial movement on another user's cashier.",
      });
    }

    const financialMovement = await this.financialMovementsRepository.create({
      cashier_id,
      user_id,
      description,
      due_date,
      type,
      value,
      status,
    });

    if (status === 'paid_out' && type === 'income') {
      const newBalance = cashier.balance + value;

      cashier.balance = newBalance;

      await this.cashiersRepository.save(cashier);
    } else if (status === 'paid_out' && type === 'outcome') {
      const newBalance = cashier.balance - value;

      cashier.balance = newBalance;

      await this.cashiersRepository.save(cashier);
    }

    return financialMovement;
  }
}
