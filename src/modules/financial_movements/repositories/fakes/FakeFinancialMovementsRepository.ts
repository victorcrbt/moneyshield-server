import { FinancialMovement } from '@prisma/client';
import { uuid } from 'uuidv4';
import _ from 'lodash';

import IFinancialMovementsRepository from '@modules/financial_movements/repositories/IFinancialMovementsRepository';

import ICreateFinancialMovementDTO from '@modules/financial_movements/dtos/ICreateFinancialMovementDTO';
import IFindFinancialMovementByIDDTO from '@modules/financial_movements/dtos/IFindFinancialMovementByIDDTO';
import IFindFinancialMovementByUserIDDTO from '@modules/financial_movements/dtos/IFindFinancialMovementByUserIDDTO';

export default class FakeFinancialMovementsRepository
  implements IFinancialMovementsRepository {
  private financialMovementsRepository: FinancialMovement[] = [];

  public async create({
    cashier_id,
    user_id,
    description,
    type,
    due_date,
    value,
    status = 'pending',
  }: ICreateFinancialMovementDTO): Promise<FinancialMovement> {
    const financialMovement: FinancialMovement = {
      id: uuid(),
      cashier_id,
      user_id,
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

  public async findByID({
    financial_movement_id,
  }: IFindFinancialMovementByIDDTO): Promise<FinancialMovement | null> {
    const foundFinancialMovement = this.financialMovementsRepository.find(
      financialMovement => financialMovement.id === financial_movement_id
    );

    if (!foundFinancialMovement) return null;

    return foundFinancialMovement;
  }

  public async findByUserID({
    user_id,
    status,
    sorting,
  }: IFindFinancialMovementByUserIDDTO): Promise<FinancialMovement[]> {
    let foundFinancialMovements = this.financialMovementsRepository.filter(
      financialMovement => financialMovement.user_id === user_id
    );

    if (status) {
      foundFinancialMovements = foundFinancialMovements.filter(
        financialMovement => financialMovement.status === status
      );
    }

    let sortedFinacialMovements = _.sortBy(
      foundFinancialMovements,
      sorting?.field || 'id'
    );

    if (sorting?.order === 'desc') {
      sortedFinacialMovements = _.reverse(sortedFinacialMovements);
    }

    return sortedFinacialMovements;
  }

  public async save(
    financialMovement: FinancialMovement
  ): Promise<FinancialMovement> {
    const financialMovementIndex = this.financialMovementsRepository.findIndex(
      financialMovementInRepo =>
        financialMovementInRepo.id === financialMovement.id
    );

    this.financialMovementsRepository[
      financialMovementIndex
    ] = financialMovement;

    return financialMovement;
  }

  public async findAll(): Promise<FinancialMovement[]> {
    return this.financialMovementsRepository;
  }
}
