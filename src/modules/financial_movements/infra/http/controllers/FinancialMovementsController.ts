import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateFinancialMovementService from '@modules/financial_movements/services/CreateFinancialMovementService';
import UpdateFinancialMovementService from '@modules/financial_movements/services/UpdateFinancialMovementService';

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

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { financial_movement_id } = req.params;
    const { cashier_id, description, due_date, type } = req.body;

    const updateFinancialMovement = container.resolve(
      UpdateFinancialMovementService
    );

    const financialMovement = await updateFinancialMovement.run({
      user_id: id,
      financial_movement_id,
      cashier_id,
      description,
      due_date,
      type,
    });

    return res.status(200).json(financialMovement);
  }
}
