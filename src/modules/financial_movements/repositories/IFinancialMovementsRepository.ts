import { FinancialMovement } from '@prisma/client';

import ICreateFinancialMovementDTO from '@modules/financial_movements/dtos/ICreateFinancialMovementDTO';

export default interface IFinancialMovementsRepository {
  create(data: ICreateFinancialMovementDTO): Promise<FinancialMovement>;
}
