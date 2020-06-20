import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository';

import CreateCashierService from './CreateCashierService';

let fakeCashiersRepository: FakeCashiersRepository;
let fakeUsersRepository: FakeUsersRepository;

let createCashier: CreateCashierService;

describe('CreateCashierService', () => {
  beforeEach(() => {
    fakeCashiersRepository = new FakeCashiersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createCashier = new CreateCashierService(fakeCashiersRepository);
  });

  it('should be able to create a non bank account cashier', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await createCashier.run({
      user_id: user.id,
      name: 'Money',
    });

    const cashierList = await fakeCashiersRepository.findAll();

    expect(cashierList).toHaveLength(1);
    expect(cashierList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: user.id,
          is_bank_account: false,
          name: 'Money',
          bank_name: null,
          bank_branch: null,
          bank_account: null,
          account_type: null,
          balance: 0,
        }),
      ])
    );
  });

  it('should be able to create a bank account cashier', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await createCashier.run({
      user_id: user.id,
      is_bank_account: true,
      name: 'National Bank',
      bank_name: 'National Bank S/A',
      bank_branch: '1234',
      bank_account: '123456789',
      account_type: 'savings',
    });

    const cashierList = await fakeCashiersRepository.findAll();

    expect(cashierList).toHaveLength(1);
    expect(cashierList).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: user.id,
          is_bank_account: true,
          name: 'National Bank',
          bank_name: 'National Bank S/A',
          bank_branch: '1234',
          bank_account: '123456789',
          account_type: 'savings',
          balance: 0,
        }),
      ])
    );
  });
});
