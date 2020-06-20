import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/error/AppError';
import FakeCashiersRepository from '../repositories/fakes/FakeCashiersRepository';

import VisualizeCashierService from './VisualizeCashierService';

let fakeCashiersRepository: FakeCashiersRepository;
let fakeUsersRepository: FakeUsersRepository;

let visualizeCashier: VisualizeCashierService;

describe('VisualizeCashierService', () => {
  beforeEach(() => {
    fakeCashiersRepository = new FakeCashiersRepository();
    fakeUsersRepository = new FakeUsersRepository();

    visualizeCashier = new VisualizeCashierService(fakeCashiersRepository);
  });

  it('should be able to visualize own cashier', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const cashier = await fakeCashiersRepository.create({
      user_id: user.id,
      name: 'Money',
    });

    const foundCashier = await visualizeCashier.run({
      user_id: user.id,
      cashier_id: cashier.id,
    });

    expect(foundCashier).toMatchObject({
      user_id: user.id,
      name: 'Money',
    });
  });

  it('should not be able to visualize another user cashier', async () => {
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
      visualizeCashier.run({
        user_id: user.id,
        cashier_id: cashier.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await visualizeCashier.run({
        user_id: user.id,
        cashier_id: cashier.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 403);
      expect(error).toHaveProperty(
        'message',
        "You can't visualize another client's cashier."
      );
    }
  });

  it('should return an error if the cashier does not exist', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });
    await expect(
      visualizeCashier.run({
        user_id: user.id,
        cashier_id: 'non-existing-cashier',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await visualizeCashier.run({
        user_id: user.id,
        cashier_id: 'non-existing-cashier',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Cashier not found.');
    }
  });
});
