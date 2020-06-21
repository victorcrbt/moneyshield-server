import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ToggleFinancialMovementStatusService from '@modules/financial_movements/services/ToggleFinancialMovementStatusService';

export default class PaymentStatusController {
  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { financial_movement_id } = req.params;

    const toggleFinancialMovementStatus = container.resolve(
      ToggleFinancialMovementStatusService
    );

    const financialMovement = await toggleFinancialMovementStatus.run({
      user_id: id,
      financial_movement_id,
    });

    return res.status(200).json(financialMovement);
  }
}
