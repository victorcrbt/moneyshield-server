import { injectable, inject } from 'tsyringe';
import { FinancialMovement } from '@prisma/client';

import AppError from '@shared/error/AppError';
import IFinancialMovementsRepository from '../repositories/IFinancialMovementsRepository';

interface IRequestDTO {
  user_id: string;
  financial_movement_id: string;
}

@injectable()
export default class VisualizeFinancialMovementService {
  constructor(
    @inject('FinancialMovementsRepository')
    private financialMovementsRepository: IFinancialMovementsRepository
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

    if (financialMovement.user_id !== user_id) {
      throw new AppError({
        status: 403,
        message: 'You can only visualize your own financial movements.',
      });
    }

    return financialMovement;
  }
}
