import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/error/AppError';
import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository';

import UpdateCashierService from './UpdateCashierService';

let fakeCashiersRepository: FakeCashiersRepository;
let fakeUsersRepository: FakeUsersRepository;

let updateCashier: UpdateCashierService;

describe('UpdateCashierService', () => {
  beforeEach(() => {
    fakeCashiersRepository = new FakeCashiersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    updateCashier = new UpdateCashierService(fakeCashiersRepository);
  });

  it('should be able to delete own cashier', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const cashierToUpdate = await fakeCashiersRepository.create({
      user_id: user.id,
      is_bank_account: true,
      name: 'National Bank',
      bank_name: 'National Bank S/A',
      bank_branch: '1234',
      bank_account: '123456789',
      account_type: 'savings',
    });

    await updateCashier.run({
      user_id: user.id,
      cashier_id: cashierToUpdate.id,
      cashier_data: {
        name: 'Update Cashier Name',
        account_type: 'checking',
      },
    });

    const cashier = await fakeCashiersRepository.findByID({
      cashier_id: cashierToUpdate.id,
    });

    expect(cashier).toMatchObject({
      user_id: user.id,
      is_bank_account: true,
      name: 'Update Cashier Name',
      bank_name: 'National Bank S/A',
      bank_branch: '1234',
      bank_account: '123456789',
      account_type: 'checking',
    });
  });

  it('should return an error if there is no cashier with the provided id', async () => {
    await expect(
      updateCashier.run({
        user_id: 'non-existing-user',
        cashier_id: 'non-existing-cashier',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateCashier.run({
        user_id: 'non-existing-user',
        cashier_id: 'non-existing-cashier',
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

    const cashierToDelete = await fakeCashiersRepository.create({
      user_id: 'another-user-id',
      name: 'Money',
    });

    await expect(
      updateCashier.run({
        user_id: user.id,
        cashier_id: cashierToDelete.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateCashier.run({
        user_id: user.id,
        cashier_id: cashierToDelete.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 403);
      expect(error).toHaveProperty(
        'message',
        "You can't update another user's cashier."
      );
    }
  });
});
