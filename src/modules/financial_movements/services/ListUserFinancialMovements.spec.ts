import 'reflect-metadata';

import FakeFinancialMovementsRepository from '@modules/financial_movements/repositories/fakes/FakeFinancialMovementsRepository';

import ListUserFiancialMovementsService from './ListUserFinancialMovements';

let fakeFinancialMovementsRepository: FakeFinancialMovementsRepository;

let listUserFinancialMovements: ListUserFiancialMovementsService;

describe('ListUserFinancialMovements', () => {
  beforeEach(() => {
    fakeFinancialMovementsRepository = new FakeFinancialMovementsRepository();

    listUserFinancialMovements = new ListUserFiancialMovementsService(
      fakeFinancialMovementsRepository
    );
  });

  it('should be able all the financial movements from a specific user', async () => {
    await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Rent',
      due_date: new Date(2020, 5, 20),
      value: 800,
      type: 'outcome',
      status: 'paid_out',
    });

    await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Salary',
      due_date: new Date(2020, 5, 20),
      value: 3000,
      type: 'income',
      status: 'paid_out',
    });

    await fakeFinancialMovementsRepository.create({
      cashier_id: 'second-user-cashier',
      user_id: 'second-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    const financialMovements = await listUserFinancialMovements.run({
      user_id: 'first-user-id',
    });

    expect(financialMovements).toHaveLength(3);
    expect(financialMovements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          cashier_id: 'first-user-cashier',
          user_id: 'first-user-id',
          description: 'Credit card',
          due_date: new Date(2020, 5, 20),
          value: 274.32,
          type: 'outcome',
          status: 'pending',
        }),
        expect.objectContaining({
          cashier_id: 'first-user-cashier',
          user_id: 'first-user-id',
          description: 'Rent',
          due_date: new Date(2020, 5, 20),
          value: 800,
          type: 'outcome',
          status: 'paid_out',
        }),
        expect.objectContaining({
          cashier_id: 'first-user-cashier',
          user_id: 'first-user-id',
          description: 'Salary',
          due_date: new Date(2020, 5, 20),
          value: 3000,
          type: 'income',
          status: 'paid_out',
        }),
      ])
    );
  });

  it('should be able to filter the financial movements by status', async () => {
    await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Rent',
      due_date: new Date(2020, 5, 20),
      value: 800,
      type: 'outcome',
      status: 'paid_out',
    });

    await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Salary',
      due_date: new Date(2020, 5, 20),
      value: 3000,
      type: 'income',
      status: 'paid_out',
    });

    const financialMovements = await listUserFinancialMovements.run({
      user_id: 'first-user-id',
      status: 'pending',
    });

    expect(financialMovements).toHaveLength(1);
    expect(financialMovements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          cashier_id: 'first-user-cashier',
          user_id: 'first-user-id',
          description: 'Credit card',
          due_date: new Date(2020, 5, 20),
          value: 274.32,
          type: 'outcome',
          status: 'pending',
        }),
      ])
    );
  });

  it('should be able to sort the movements by due date', async () => {
    const firstMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 25),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    const secondMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Salary',
      due_date: new Date(2020, 5, 21),
      value: 3000,
      type: 'income',
      status: 'paid_out',
    });

    const thirdMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Rent',
      due_date: new Date(2020, 5, 23),
      value: 800,
      type: 'outcome',
      status: 'paid_out',
    });

    const financialMovements = await listUserFinancialMovements.run({
      user_id: 'first-user-id',
      sorting: {
        field: 'due_date',
      },
    });

    expect(financialMovements[0]).toHaveProperty('id', secondMovement.id);
    expect(financialMovements[1]).toHaveProperty('id', thirdMovement.id);
    expect(financialMovements[2]).toHaveProperty('id', firstMovement.id);
  });

  it('should be able to sort the movements by value', async () => {
    const firstMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 25),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    const secondMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Salary',
      due_date: new Date(2020, 5, 23),
      value: 3000,
      type: 'income',
      status: 'paid_out',
    });

    const thirdMovement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'first-user-cashier',
      user_id: 'first-user-id',
      description: 'Rent',
      due_date: new Date(2020, 5, 21),
      value: 800,
      type: 'outcome',
      status: 'paid_out',
    });

    const financialMovements = await listUserFinancialMovements.run({
      user_id: 'first-user-id',
      sorting: {
        field: 'value',
      },
    });

    expect(financialMovements[0]).toHaveProperty('id', firstMovement.id);
    expect(financialMovements[1]).toHaveProperty('id', thirdMovement.id);
    expect(financialMovements[2]).toHaveProperty('id', secondMovement.id);
  });
});
