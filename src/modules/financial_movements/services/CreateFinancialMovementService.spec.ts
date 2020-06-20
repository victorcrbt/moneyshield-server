import 'reflect-metadata';

import FakeFinancialMovementsRepository from '@modules/financial_movements/repositories/fakes/FakeFinancialMovementsRepository';
import FakeCashiersRepository from '@modules/cashiers/repositories/fakes/FakeCashiersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import { Cashier } from '@prisma/client';
import AppError from '@shared/error/AppError';
import CreateFinancialMovementService from './CreateFinancialMovementService';

let fakeFinancialMovementsRepository: FakeFinancialMovementsRepository;
let fakeCashiersRepository: FakeCashiersRepository;
let fakeUsersRepository: FakeUsersRepository;

let createFinancialMovement: CreateFinancialMovementService;

describe('CreateFinancialMovementService', () => {
  beforeEach(() => {
    fakeFinancialMovementsRepository = new FakeFinancialMovementsRepository();
    fakeCashiersRepository = new FakeCashiersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createFinancialMovement = new CreateFinancialMovementService(
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
    });

    await createFinancialMovement.run({
      user_id: user.id,
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    const financialMovements = await fakeFinancialMovementsRepository.findAll();

    expect(cashier.balance).toEqual(0);

    expect(financialMovements).toHaveLength(1);
    expect(financialMovements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          cashier_id: cashier.id,
          description: 'Salary payment',
          due_date: new Date(2020, 5, 20),
          type: 'income',
          value: 3000,
        }),
      ])
    );
  });

  it('should be able to create a new financial movement and change the cashier balance on an income movement', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
    });

    await createFinancialMovement.run({
      user_id: user.id,
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'income',
      value: 3000,
      status: 'paid_out',
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    const financialMovements = await fakeFinancialMovementsRepository.findAll();

    expect(cashier.balance).toEqual(3000);

    expect(financialMovements).toHaveLength(1);
    expect(financialMovements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          cashier_id: cashier.id,
          description: 'Salary payment',
          due_date: new Date(2020, 5, 20),
          type: 'income',
          value: 3000,
        }),
      ])
    );
  });

  it('should be able to create a new financial movement and change the cashier balance on an outcome movement', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
    });

    await createFinancialMovement.run({
      user_id: user.id,
      cashier_id: cashier.id,
      description: 'Salary payment',
      due_date: new Date(2020, 5, 20),
      type: 'outcome',
      value: 3000,
      status: 'paid_out',
    });

    cashier = (await fakeCashiersRepository.findByID({
      cashier_id: cashier.id,
    })) as Cashier;

    const financialMovements = await fakeFinancialMovementsRepository.findAll();

    expect(cashier.balance).toEqual(-3000);

    expect(financialMovements).toHaveLength(1);
    expect(financialMovements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          cashier_id: cashier.id,
          description: 'Salary payment',
          due_date: new Date(2020, 5, 20),
          type: 'outcome',
          value: 3000,
        }),
      ])
    );
  });

  it('should return an error if the cashier does not exist', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await expect(
      createFinancialMovement.run({
        user_id: user.id,
        cashier_id: 'non-existing-cashier',
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'income',
        value: 3000,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await createFinancialMovement.run({
        user_id: user.id,
        cashier_id: 'non-existing-cashier',
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'income',
        value: 3000,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Cashier not found.');
    }
  });

  it('should return an error if the cashier belongs to another user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const cashier = await fakeCashiersRepository.create({
      user_id: 'another-user-id',
      name: 'Money',
    });

    await expect(
      createFinancialMovement.run({
        user_id: user.id,
        cashier_id: cashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'income',
        value: 3000,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await createFinancialMovement.run({
        user_id: user.id,
        cashier_id: cashier.id,
        description: 'Salary payment',
        due_date: new Date(2020, 5, 20),
        type: 'income',
        value: 3000,
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
