import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateFinancialMovementService from '@modules/financial_movements/services/CreateFinancialMovementService';
import ListUserFinancialMovements from '@modules/financial_movements/services/ListUserFinancialMovements';
import VisualizeFinancialMovementService from '@modules/financial_movements/services/VisualizeFinancialMovementService';
import UpdateFinancialMovementService from '@modules/financial_movements/services/UpdateFinancialMovementService';
import DeleteFinancialMovementService from '@modules/financial_movements/services/DeleteFinancialMovementService';

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

  public async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { status, sort_by, order } = req.query;

    const listUserFinancialMovements = container.resolve(
      ListUserFinancialMovements
    );

    const financialMovements = await listUserFinancialMovements.run({
      user_id: id,
      status: status as 'pending' | 'paid_out',
      sorting: {
        field: sort_by as 'due_date' | 'value',
        order: order as 'asc' | 'desc',
      },
    });

    return res.status(200).json(financialMovements);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { financial_movement_id } = req.params;

    const visualizeFinancialMovement = container.resolve(
      VisualizeFinancialMovementService
    );

    const financialMovement = await visualizeFinancialMovement.run({
      user_id: id,
      financial_movement_id,
    });

    return res.status(200).json(financialMovement);
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

  public async destroy(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { financial_movement_id } = req.params;

    const deleteFinancialMovement = container.resolve(
      DeleteFinancialMovementService
    );

    await deleteFinancialMovement.run({
      user_id: id,
      financial_movement_id,
    });

    return res.status(204).json();
  }
}
