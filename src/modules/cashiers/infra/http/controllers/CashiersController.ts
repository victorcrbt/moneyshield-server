import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCashierService from '@modules/cashiers/services/CreateCashierService';
import ListUsersCashiersService from '@modules/cashiers/services/ListUsersCashiersService';
import VisualizeCashierService from '@modules/cashiers/services/VisualizeCashierService';
import UpdateCashierService from '@modules/cashiers/services/UpdateCashierService';
import DeleteCashierService from '@modules/cashiers/services/DeleteCashierService';

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

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { cashier_id } = req.params;

    const visualizeCashier = container.resolve(VisualizeCashierService);

    const cashier = await visualizeCashier.run({
      user_id: id,
      cashier_id,
    });

    return res.status(200).json(cashier);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { cashier_id } = req.params;
    const { name, account_type } = req.body;

    const updateCashier = container.resolve(UpdateCashierService);

    const cashier = await updateCashier.run({
      user_id: id,
      cashier_id,
      cashier_data: {
        name,
        account_type,
      },
    });

    return res.status(200).json(cashier);
  }

  public async destroy(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;
    const { cashier_id } = req.params;

    const deleteCashier = container.resolve(DeleteCashierService);

    await deleteCashier.run({
      user_id: id,
      cashier_id,
    });

    return res.status(204).json();
  }
}
