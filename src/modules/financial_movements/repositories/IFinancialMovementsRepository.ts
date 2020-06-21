import { FinancialMovement } from '@prisma/client';

import ICreateFinancialMovementDTO from '@modules/financial_movements/dtos/ICreateFinancialMovementDTO';
import IFindFinancialMovementByIDDTO from '@modules/financial_movements/dtos/IFindFinancialMovementByIDDTO';
import IFindFinancialMovementByUserIDDTO from '@modules/financial_movements/dtos/IFindFinancialMovementByUserIDDTO';

export default interface IFinancialMovementsRepository {
  create(data: ICreateFinancialMovementDTO): Promise<FinancialMovement>;
  findByID(
    data: IFindFinancialMovementByIDDTO
  ): Promise<FinancialMovement | null>;
  findByUserID(
    data: IFindFinancialMovementByUserIDDTO
  ): Promise<FinancialMovement[]>;
  save(financialMovement: FinancialMovement): Promise<FinancialMovement>;
  destroy(finacnialMovement: FinancialMovement): Promise<void>;
}
