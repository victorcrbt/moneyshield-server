import 'reflect-metadata';

import FakeFinancialMovementsRepository from '@modules/financial_movements/repositories/fakes/FakeFinancialMovementsRepository';

import AppError from '@shared/error/AppError';
import VisualizeFinancialMovementService from './VisualizeFinancialMovementService';

let fakeFinancialMovementsRepository: FakeFinancialMovementsRepository;

let visualizeFinancialMovement: VisualizeFinancialMovementService;

describe('VisualizeFinancialMovementService', () => {
  beforeEach(() => {
    fakeFinancialMovementsRepository = new FakeFinancialMovementsRepository();

    visualizeFinancialMovement = new VisualizeFinancialMovementService(
      fakeFinancialMovementsRepository
    );
  });

  it('should be able to view own financial movement', async () => {
    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'existing-cashier-d',
      user_id: 'existing-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    const financialMovement = await visualizeFinancialMovement.run({
      user_id: 'existing-user-id',
      financial_movement_id: movement.id,
    });

    expect(financialMovement).toMatchObject({
      cashier_id: 'existing-cashier-d',
      user_id: 'existing-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });
  });

  it('should return an error if there is not financial movement with the provided id', async () => {
    const movement = await fakeFinancialMovementsRepository.create({
      cashier_id: 'existing-cashier-d',
      user_id: 'first-user-id',
      description: 'Credit card',
      due_date: new Date(2020, 5, 20),
      value: 274.32,
      type: 'outcome',
      status: 'pending',
    });

    await expect(
      visualizeFinancialMovement.run({
        user_id: 'second-user-id',
        financial_movement_id: movement.id,
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await visualizeFinancialMovement.run({
        user_id: 'second-user-id',
        financial_movement_id: movement.id,
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 403);
      expect(error).toHaveProperty(
        'message',
        'You can only visualize your own financial movements.'
      );
    }
  });

  it('should not be able to view another user financial movement', async () => {
    await expect(
      visualizeFinancialMovement.run({
        user_id: 'existing-user-id',
        financial_movement_id: 'non-existing-financial-movement',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await visualizeFinancialMovement.run({
        user_id: 'existing-user-id',
        financial_movement_id: 'non-existing-financial-movement',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Financial movement not found.');
    }
  });
});
