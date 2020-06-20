import { FinancialMovement } from '@prisma/client';

import ICreateFinancialMovementDTO from '@modules/financial_movements/dtos/ICreateFinancialMovementDTO';
import IFindFinancialMovementByIDDTO from '@modules/financial_movements/dtos/IFindFinancialMovementByIDDTO';

export default interface IFinancialMovementsRepository {
  create(data: ICreateFinancialMovementDTO): Promise<FinancialMovement>;
  findByID(
    data: IFindFinancialMovementByIDDTO
  ): Promise<FinancialMovement | null>;
  save(financialMovement: FinancialMovement): Promise<FinancialMovement>;
}
