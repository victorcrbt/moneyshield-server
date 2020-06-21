import { FinancialMovement, PrismaClient } from '@prisma/client';
import { uuid } from 'uuidv4';

import IFinancialMovementsRepository from '@modules/financial_movements/repositories/IFinancialMovementsRepository';

import ICreateFinancialMovementDTO from '@modules/financial_movements/dtos/ICreateFinancialMovementDTO';
import IFindFinancialMovementByIDDTO from '@modules/financial_movements/dtos/IFindFinancialMovementByIDDTO';

export default class FinancialMovementsRepository
  implements IFinancialMovementsRepository {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();
  }

  public async create({
    cashier_id,
    user_id,
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
        user: {
          connect: {
            id: user_id,
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

  public async findByID({
    financial_movement_id,
  }: IFindFinancialMovementByIDDTO): Promise<FinancialMovement | null> {
    const financialMovement = await this.client.financialMovement.findOne({
      where: {
        id: financial_movement_id,
      },
    });

    return financialMovement;
  }

  public async save(
    financialMovement: FinancialMovement
  ): Promise<FinancialMovement> {
    await this.client.financialMovement.update({
      where: {
        id: financialMovement.id,
      },
      data: {
        description: financialMovement.description,
        due_date: financialMovement.due_date,
        status: financialMovement.status,
        type: financialMovement.type,
        cashier: {
          connect: {
            id: financialMovement.cashier_id,
          },
        },
      },
    });

    return financialMovement;
  }
}
