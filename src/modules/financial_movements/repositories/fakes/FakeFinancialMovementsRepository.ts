import { FinancialMovement } from '@prisma/client';
import { uuid } from 'uuidv4';

import IFinancialMovementsRepository from '@modules/financial_movements/repositories/IFinancialMovementsRepository';

import ICreateFinancialMovementDTO from '@modules/financial_movements/dtos/ICreateFinancialMovementDTO';

export default class FakeFinancialMovementsRepository
  implements IFinancialMovementsRepository {
  private financialMovementsRepository: FinancialMovement[] = [];

  public async create({
    cashier_id,
    description,
    type,
    due_date,
    value,
    status = 'pending',
  }: ICreateFinancialMovementDTO): Promise<FinancialMovement> {
    const financialMovement: FinancialMovement = {
      id: uuid(),
      cashier_id,
      description,
      type,
      due_date,
      value,
      status,
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
    };

    this.financialMovementsRepository.push(financialMovement);

    return financialMovement;
  }

  public async findAll(): Promise<FinancialMovement[]> {
    return this.financialMovementsRepository;
  }
}
