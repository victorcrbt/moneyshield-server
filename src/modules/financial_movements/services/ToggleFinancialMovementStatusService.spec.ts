import 'reflect-metadata';
import { Cashier } from '@prisma/client';

import FakeFinancialMovementsRepository from '@modules/financial_movements/repositories/fakes/FakeFinancialMovementsRepository';
import FakeCashiersRepository from '@modules/cashiers/repositories/fakes/FakeCashiersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import AppError from '@shared/error/AppError';
import ToggleFinancialMovementStatus from './ToggleFinancialMovementStatusService';

let fakeFinancialMovementsRepository: FakeFinancialMovementsRepository;
let fakeCashiersRepository: FakeCashiersRepository;
let fakeUsersRepository: FakeUsersRepository;

let toggleFinancialMovementStatus: ToggleFinancialMovementStatus;

describe('toggleFinancialMovementStatusService', () => {
  beforeEach(() => {
    fakeFinancialMovementsRepository = new FakeFinancialMovementsRepository();
    fakeCashiersRepository = new FakeCashiersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    toggleFinancialMovementStatus = new ToggleFinancialMovementStatus(
      fakeFinancialMovementsRepository,
      fakeCashiersRepository
    );
  });

  it('should be able to toggle between status', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
    });

    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
      status: 'pending',
    });

    let financialMovement = await toggleFinancialMovementStatus.run({
      user_id: user.id,
      financial_movement_id: movement.id,
    });

    expect(financialMovement).toMatchObject({
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
      status: 'paid_out',
    });

    financialMovement = await toggleFinancialMovementStatus.run({
      user_id: user.id,
      financial_movement_id: movement.id,
    });

    expect(financialMovement).toMatchObject({
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
      status: 'pending',
    });
  });

  it('should increase de balance if the status is paid_out and the type of the movement is income', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 0,
    });

    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
      status: 'pending',
    });

    await toggleFinancialMovementStatus.run({
      user_id: user.id,
      financial_movement_id: movement.id,
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toBe(3000);
  });

  it('should decrease de balance if the status is peding and the type of the movement is income', async () => {
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

    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
      status: 'paid_out',
    });

    await toggleFinancialMovementStatus.run({
      user_id: user.id,
      financial_movement_id: movement.id,
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toBe(0);
  });

  it('should decrease de balance if the status is paid_out and the type of the movement is outcome', async () => {
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

    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'outcome',
      value: 3000,
      status: 'pending',
    });

    await toggleFinancialMovementStatus.run({
      user_id: user.id,
      financial_movement_id: movement.id,
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toBe(0);
  });

  it('should increase de balance if the status is peding and the type of the movement is outcome', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 0,
    });

    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'outcome',
      value: 3000,
      status: 'paid_out',
    });

    await toggleFinancialMovementStatus.run({
      user_id: user.id,
      financial_movement_id: movement.id,
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    expect(cashier.balance).toBe(3000);
  });

  it('should return an error if the financial movement does not exist', async () => {
    await expect(
      toggleFinancialMovementStatus.run({
        user_id: 'non-existing-user',
        financial_movement_id: 'non-existing-movement',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await toggleFinancialMovementStatus.run({
        user_id: 'non-existing-user',
        financial_movement_id: 'non-existing-movement',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Financial movement not found.');
    }
  });

  it('should return an error if the cashier does not exist', async () => {
    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'non-existing-cashier',
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
      status: 'pending',
    });

    await expect(
      toggleFinancialMovementStatus.run({
        user_id: 'non-existing-user',
        financial_movement_id: movement.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await toggleFinancialMovementStatus.run({
        user_id: 'non-existing-user',
        financial_movement_id: movement.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty(
        'message',
        'Cashier not found for this movement.'
      );
    }
  });

  it('should return an error if the movement belongs to another user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
    });

    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
      status: 'pending',
    });

    await expect(
      toggleFinancialMovementStatus.run({
        user_id: 'another-user-id',
        financial_movement_id: movement.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await toggleFinancialMovementStatus.run({
        user_id: 'another-user-id',
        financial_movement_id: movement.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 403);
      expect(error).toHaveProperty(
        'message',
        "You cannot change the status of another user's movement."
      );
    }
  });
});
