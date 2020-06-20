import 'reflect-metadata';

import { Cashier } from '@prisma/client';

import FakeFinancialMovementsRepository from '@modules/financial_movements/repositories/fakes/FakeFinancialMovementsRepository';
import FakeCashiersRepository from '@modules/cashiers/repositories/fakes/FakeCashiersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/error/AppError';

import UpdateFinancialMovementService from './UpdateFinancialMovementService';

let fakeFinancialMovementsRepository: FakeFinancialMovementsRepository;
let fakeCashiersRepository: FakeCashiersRepository;
let fakeUsersRepository: FakeUsersRepository;

let updateFinancialMovement: UpdateFinancialMovementService;

describe('UpdateFinancialMovementService', () => {
  beforeEach(() => {
    fakeFinancialMovementsRepository = new FakeFinancialMovementsRepository();
    fakeCashiersRepository = new FakeCashiersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    updateFinancialMovement = new UpdateFinancialMovementService(
      fakeFinancialMovementsRepository,
      fakeCashiersRepository
    );
  });

  it('should be able to create a new financial movement without change the cashier balance', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 3000,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: cashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'income',
        value: 3000,
      }
    );

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: cashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'income',
      due_date: new Date(2020, 6, 20),
    });

    const updatedFinancialMovement = await fakeFinancialMovementsRepository.findByID(
      {
        financial_movement_id: financialMovementToUpdate.id,
      }
    );

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toEqual(3000);

    expect(updatedFinancialMovement).toMatchObject({
      cashier_id: cashier.id,
      description: 'July salary payment',
      type: 'income',
      due_date: new Date(2020, 6, 20),
      value: 3000,
    });
  });

  it('should adjust decrease the cashier balance if the type is change from income to outcome', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 4000,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: cashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'income',
        value: 3000,
        status: 'paid_out',
      }
    );

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: cashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'outcome',
      due_date: new Date(2020, 6, 20),
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toEqual(-2000);

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: cashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'outcome',
      due_date: new Date(2020, 6, 20),
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toEqual(-2000);
  });

  it('should adjust increase the cashier balance if the type is change from outcome to income', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: -2000,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: cashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'outcome',
        value: 3000,
        status: 'paid_out',
      }
    );

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: cashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'income',
      due_date: new Date(2020, 6, 20),
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toEqual(4000);

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: cashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'income',
      due_date: new Date(2020, 6, 20),
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toEqual(4000);
  });

  it('should adjust the source and target cashier balance if the cashier is changed, the status is paid out and the type type is income', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let sourceCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 3000,
    });

    let targetCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Bank',
      is_bank_account: true,
      account_type: 'savings',
      bank_account: '12345',
      bank_branch: '1234',
      bank_name: 'National Bank',
      balance: 0,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: sourceCashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'income',
        value: 3000,
        status: 'paid_out',
      }
    );

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: targetCashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'income',
      due_date: new Date(2020, 6, 20),
    });

    sourceCashier = (await fakeCashiersRepository.findByID({
      cashier_id: sourceCashier.id,
    })) as Cashier;

    targetCashier = (await fakeCashiersRepository.findByID({
      cashier_id: targetCashier.id,
    })) as Cashier;

    expect(sourceCashier.balance).toEqual(0);
    expect(targetCashier.balance).toEqual(3000);
  });

  it('should adjust the source and target cashier balance if the cashier is changed, the status is paid out and the type is outcome', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let sourceCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 0,
    });

    let targetCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Bank',
      is_bank_account: true,
      account_type: 'savings',
      bank_account: '12345',
      bank_branch: '1234',
      bank_name: 'National Bank',
      balance: 3000,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: sourceCashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'outcome',
        value: 3000,
        status: 'paid_out',
      }
    );

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: targetCashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'outcome',
      due_date: new Date(2020, 6, 20),
    });

    sourceCashier = (await fakeCashiersRepository.findByID({
      cashier_id: sourceCashier.id,
    })) as Cashier;

    targetCashier = (await fakeCashiersRepository.findByID({
      cashier_id: targetCashier.id,
    })) as Cashier;

    expect(sourceCashier.balance).toEqual(3000);
    expect(targetCashier.balance).toEqual(0);
  });

  it('should adjust the source and target cashier balance if the cashier is changed, the status is paid out and the type type is changed to outcome', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let sourceCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 3000,
    });

    let targetCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Bank',
      is_bank_account: true,
      account_type: 'savings',
      bank_account: '12345',
      bank_branch: '1234',
      bank_name: 'National Bank',
      balance: 0,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: sourceCashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'income',
        value: 3000,
        status: 'paid_out',
      }
    );

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: targetCashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'outcome',
      due_date: new Date(2020, 6, 20),
    });

    sourceCashier = (await fakeCashiersRepository.findByID({
      cashier_id: sourceCashier.id,
    })) as Cashier;

    targetCashier = (await fakeCashiersRepository.findByID({
      cashier_id: targetCashier.id,
    })) as Cashier;

    expect(sourceCashier.balance).toEqual(0);
    expect(targetCashier.balance).toEqual(-3000);
  });

  it('should adjust the source and target cashier balance if the cashier is changed, the status is paid out and the type is changed to income', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let sourceCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 0,
    });

    let targetCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Bank',
      is_bank_account: true,
      account_type: 'savings',
      bank_account: '12345',
      bank_branch: '1234',
      bank_name: 'National Bank',
      balance: 3000,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: sourceCashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'outcome',
        value: 3000,
        status: 'paid_out',
      }
    );

    await updateFinancialMovement.run({
      user_id: user.id,
      cashier_id: targetCashier.id,
      financial_movement_id: financialMovementToUpdate.id,
      description: 'July salary payment',
      type: 'income',
      due_date: new Date(2020, 6, 20),
    });

    sourceCashier = (await fakeCashiersRepository.findByID({
      cashier_id: sourceCashier.id,
    })) as Cashier;

    targetCashier = (await fakeCashiersRepository.findByID({
      cashier_id: targetCashier.id,
    })) as Cashier;

    expect(sourceCashier.balance).toEqual(3000);
    expect(targetCashier.balance).toEqual(6000);
  });

  it('should return an error if there is no financial movement with the provided id', async () => {
    await expect(
      updateFinancialMovement.run({
        user_id: 'non-existing-user',
        cashier_id: 'non-existing-cashier',
        financial_movement_id: 'non-existing-movement',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateFinancialMovement.run({
        user_id: 'non-existing-user',
        cashier_id: 'non-existing-cashier',
        financial_movement_id: 'non-existing-movement',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Financial movement not found.');
    }
  });

  it('should return an error if there is no source cashier does not exist', async () => {
    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: 'non-existing-cashier',
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'outcome',
        value: 3000,
        status: 'paid_out',
      }
    );

    await expect(
      updateFinancialMovement.run({
        user_id: 'non-existing-user',
        cashier_id: 'non-existing-cashier',
        financial_movement_id: financialMovementToUpdate.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateFinancialMovement.run({
        user_id: 'non-existing-user',
        cashier_id: 'non-existing-cashier',
        financial_movement_id: financialMovementToUpdate.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Source cashier not found.');
    }
  });

  it('should return an error if there is no source target does not exist', async () => {
    const sourceCashier = await fakeCashiersRepository.create({
      user_id: 'non-existing-user',
      name: 'Money',
      balance: 0,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: sourceCashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'outcome',
        value: 3000,
        status: 'paid_out',
      }
    );

    await expect(
      updateFinancialMovement.run({
        user_id: 'non-existing-user',
        cashier_id: 'non-existing-target-cashier',
        financial_movement_id: financialMovementToUpdate.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateFinancialMovement.run({
        user_id: 'non-existing-user',
        cashier_id: 'non-existing-target-cashier',
        financial_movement_id: financialMovementToUpdate.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Target cashier not found.');
    }
  });

  it('should return an error if trying to update to a cashier that does not belong to the user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const sourceCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 0,
    });

    const targetCashier = await fakeCashiersRepository.create({
      user_id: 'another-user-id',
      name: 'Money',
      balance: 0,
    });

    const financialMovementToUpdate = await fakeFinancialMovementsRepository.create(
      {
        cashier_id: sourceCashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'outcome',
        value: 3000,
        status: 'paid_out',
      }
    );

    await expect(
      updateFinancialMovement.run({
        user_id: user.id,
        cashier_id: targetCashier.id,
        financial_movement_id: financialMovementToUpdate.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateFinancialMovement.run({
        user_id: user.id,
        cashier_id: targetCashier.id,
        financial_movement_id: financialMovementToUpdate.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 403);
      expect(error).toHaveProperty(
        'message',
        "You cannot include a financial movement on another user's cashier."
      );
    }
  });
});
