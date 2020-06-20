import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCashierService from '@modules/cashiers/services/CreateCashierService';
import ListUsersCashiersService from '@modules/cashiers/services/ListUsersCashiersService';

export default class CashiersController {
  public async store(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const {
      name,
      is_bank_account,
      bank_name,
      bank_branch,
      bank_account,
      account_type,
    } = req.body;

    const createCashier = container.resolve(CreateCashierService);

    const cashier = await createCashier.run({
      user_id: id,
      name,
      is_bank_account,
      bank_name,
      bank_branch,
      bank_account,
      account_type,
    });

    return res.status(201).json(cashier);
  }

  public async index(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { sort_by, order = 'asc' } = req.query;

    const listUserCashiers = container.resolve(ListUsersCashiersService);

    const field = sort_by as 'name' | 'balance';
    const cashiers = await listUserCashiers.run({
      user_id: id,
      sorting: {
        field,
        order: order as 'asc' | 'desc',
      },
    });

    return res.status(200).json(cashiers);
  }
}
