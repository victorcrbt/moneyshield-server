import { FinancialMovement, PrismaClient } from '@prisma/client';
import { uuid } from 'uuidv4';

import IFinancialMovementsRepository from '@modules/financial_movements/repositories/IFinancialMovementsRepository';

import ICreateFinancialMovementDTO from '@modules/financial_movements/dtos/ICreateFinancialMovementDTO';

export default class FinancialMovementsRepository
  implements IFinancialMovementsRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  public async create({
    cashier_id,
    description,
    type,
    due_date,
    value,
    status = 'pending',
  }: ICreateFinancialMovementDTO): Promise<FinancialMovement> {
    const financialMovement = await this.client.financialMovement.create({
      data: {
        id: uuid(),
        cashier: {
          connect: {
            id: cashier_id,
          },
        },
        description,
        type,
        due_date,
        value,
        status,
      },
    });

    return financialMovement;
  }
}
