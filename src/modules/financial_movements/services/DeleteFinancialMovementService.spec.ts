import 'reflect-metadata';
import { Cashier } from '@prisma/client';

import FakeFinancialMovementsRepository from '@modules/financial_movements/repositories/fakes/FakeFinancialMovementsRepository';
import FakeCashiersRepository from '@modules/cashiers/repositories/fakes/FakeCashiersRepository';

import AppError from '@shared/error/AppError';

import DeleteFinancialMovementService from './DeleteFinancialMovementService';

let fakeFinancialMovementsRepository: FakeFinancialMovementsRepository;
let fakeCashiersRepository: FakeCashiersRepository;

let deleteFinancialMovement: DeleteFinancialMovementService;

describe('DeleteFinancialMovementService', () => {
  beforeEach(() => {
    fakeFinancialMovementsRepository = new FakeFinancialMovementsRepository();
    fakeCashiersRepository = new FakeCashiersRepository();

    deleteFinancialMovement = new DeleteFinancialMovementService(
      fakeFinancialMovementsRepository,
      fakeCashiersRepository
    );
  });

  it('should be able to delete financial movement', async () => {
    const cashier = await fakeCashiersRepository.create({
      name: 'Money',
      is_bank_account: false,
      user_id: 'existing-user-id',
    });

    const financialMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      user_id: 'existing-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    await deleteFinancialMovement.run({
      user_id: 'existing-user-id',
      financial_movement_id: financialMovement.id,
    });

    const financialMovementList = await fakeFinancialMovementsRepository.findAll();

    expect(financialMovementList).toHaveLength(0);
  });

  it('should decrease the cashier balance if the type is income', async () => {
    let cashier = await fakeCashiersRepository.create({
      name: 'Money',
      is_bank_account: false,
      user_id: 'existing-user-id',
      balance: 274.32,
    });

    const financialMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      user_id: 'existing-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'income',
      status: 'paid_out',
    });

    await deleteFinancialMovement.run({
      user_id: 'existing-user-id',
      financial_movement_id: financialMovement.id,
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toEqual(0);
  });

  it('should increase the cashier balance if the type is outcome', async () => {
    let cashier = await fakeCashiersRepository.create({
      name: 'Money',
      is_bank_account: false,
      user_id: 'existing-user-id',
      balance: 0,
    });

    const financialMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      user_id: 'existing-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'paid_out',
    });

    await deleteFinancialMovement.run({
      user_id: 'existing-user-id',
      financial_movement_id: financialMovement.id,
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toEqual(274.32);
  });

  it('should return an error if the financial movement does not exist', async () => {
    await expect(
      deleteFinancialMovement.run({
        user_id: 'existing-user-id',
        financial_movement_id: 'non-existing-movement',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await deleteFinancialMovement.run({
        user_id: 'existing-user-id',
        financial_movement_id: 'non-existing-movement',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Financial movement not found.');
    }
  });

  it('should not be able to delete another user financial movement', async () => {
    const financialMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'existing-cashier-id',
      user_id: 'first-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    await expect(
      deleteFinancialMovement.run({
        user_id: 'second-user-id',
        financial_movement_id: financialMovement.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await deleteFinancialMovement.run({
        user_id: 'second-user-id',
        financial_movement_id: financialMovement.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 403);
      expect(error).toHaveProperty(
        'message',
        'You can only delete your own financial movements.'
      );
    }
  });

  it('should return an error if the cashier from the movement does not exist', async () => {
    const financialMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'non-existing-cashier',
      user_id: 'existing-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'paid_out',
    });

    await expect(
      deleteFinancialMovement.run({
        user_id: 'existing-user-id',
        financial_movement_id: financialMovement.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await deleteFinancialMovement.run({
        user_id: 'existing-user-id',
        financial_movement_id: financialMovement.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Cashier not found.');
    }
  });
});
