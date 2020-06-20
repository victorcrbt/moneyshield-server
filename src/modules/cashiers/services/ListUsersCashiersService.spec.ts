import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository';

import ListUsersCashiersService from './ListUsersCashiersService';

let fakeCashiersRepository: FakeCashiersRepository;
let fakeUsersRepository: FakeUsersRepository;

let listUserCashiers: ListUsersCashiersService;

describe('ListUsersCashiersService', () => {
  beforeEach(() => {
    fakeCashiersRepository = new FakeCashiersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    listUserCashiers = new ListUsersCashiersService(fakeCashiersRepository);
  });

  it('should be able to list all specific user cashiers', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
    });

    await fakeCashiersRepository.create({
      user_id: user.id,
      is_bank_account: true,
      name: 'National Bank',
      bank_name: 'National Bank S/A',
      bank_branch: '1234',
      bank_account: '123456789',
      account_type: 'savings',
    });

    await fakeCashiersRepository.create({
      user_id: 'another-user-id',
      name: 'Money',
    });

    const cashiers = await listUserCashiers.run({ user_id: user.id });

    expect(cashiers).toHaveLength(2);
    expect(cashiers).toEqual(
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

  it('should be able to sort by cashier name', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const bankCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      is_bank_account: true,
      name: 'National Bank',
      bank_name: 'National Bank S/A',
      bank_branch: '1234',
      bank_account: '123456789',
      account_type: 'savings',
    });

    const moneyCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
    });

    const creditCardCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Credit Card',
    });

    const cashiers = await listUserCashiers.run({
      user_id: user.id,
      sorting: {
        field: 'name',
      },
    });

    expect(cashiers[0]).toHaveProperty('id', creditCardCashier.id);
    expect(cashiers[1]).toHaveProperty('id', moneyCashier.id);
    expect(cashiers[2]).toHaveProperty('id', bankCashier.id);
  });

  it('should be able to sort by cashier balance', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const bankCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      is_bank_account: true,
      name: 'National Bank',
      bank_name: 'National Bank S/A',
      bank_branch: '1234',
      bank_account: '123456789',
      account_type: 'savings',
      balance: 1000,
    });

    const moneyCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
      balance: 5000,
    });

    const creditCardCashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Credit Card',
      balance: 3000,
    });

    const cashiers = await listUserCashiers.run({
      user_id: user.id,
      sorting: {
        field: 'balance',
        order: 'desc',
      },
    });

    expect(cashiers[0]).toHaveProperty('id', moneyCashier.id);
    expect(cashiers[1]).toHaveProperty('id', creditCardCashier.id);
    expect(cashiers[2]).toHaveProperty('id', bankCashier.id);
  });
});
