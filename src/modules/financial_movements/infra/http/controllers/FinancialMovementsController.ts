import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateFinancialMovementService from '@modules/financial_movements/services/CreateFinancialMovementService';

export default class FinancialMovementsController {
  public async store(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { cashier_id, description, type, due_date, value, status } = req.body;

    const createFinancialMovement = container.resolve(
      CreateFinancialMovementService
    );

    const financialMovement = await createFinancialMovement.run({
      user_id: id,
      cashier_id,
      description,
      type,
      due_date,
      value,
      status,
    });

    return res.status(201).json(financialMovement);
  }
}
