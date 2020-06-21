import { injectable, inject } from 'tsyringe';
import { FinancialMovement } from '@prisma/client';

import AppError from '@shared/error/AppError';
import IFinancialMovementsRepository from '../repositories/IFinancialMovementsRepository';

interface IRequestDTO {
  user_id: string;
  status?: 'pending' | 'paid_out';
  sorting?: {
    field: 'due_date' | 'value';
    order?: 'asc' | 'desc';
  };
}

@injectable()
export default class ListUserFinancialMovements {
  constructor(
    @inject('FinancialMovementsRepository')
    private financialMovementsRepository: IFinancialMovementsRepository
  ) {}

  public async run({
    user_id,
    status,
    sorting,
  }: IRequestDTO): Promise<FinancialMovement[]> {
    const financialMovements = await this.financialMovementsRepository.findByUserID(
      {
        user_id,
        status,
        sorting,
      }
    );

    return financialMovements;
  }
}
