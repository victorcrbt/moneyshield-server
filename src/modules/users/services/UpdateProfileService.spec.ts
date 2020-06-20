import 'reflect-metadata';

import AppError from '@shared/error/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfile: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to update the profile', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await updateProfile.run({
      user_id: id,
      profile_data: {
        name: 'John Tre',
        email: 'john_tre@email.com',
      },
    });

    const user = await fakeUsersRepository.findByID({ user_id: id });

    expect(user).toHaveProperty('name', 'John Tre');
    expect(user).toHaveProperty('email', 'john_tre@email.com');
    expect(user).toHaveProperty('password', '123456');
  });

  it('should be able to update the password', async () => {
    const compareHash = jest.spyOn(fakeHashProvider, 'compareHash');

    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await updateProfile.run({
      user_id: id,
      profile_data: {
        name: 'John Tre',
        email: 'john_tre@email.com',
        old_password: '123456',
        password: '000000',
      },
    });

    const user = await fakeUsersRepository.findByID({ user_id: id });

    expect(compareHash).toHaveBeenCalledWith({
      payload: '123456',
      hash: '123456',
    });

    expect(user).toHaveProperty('name', 'John Tre');
    expect(user).toHaveProperty('email', 'john_tre@email.com');
    expect(user).toHaveProperty('password', '000000');
  });

  it('should not be able to update the password without providing the old password', async () => {
    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.run({
        user_id: id,
        profile_data: {
          name: 'John Tre',
          email: 'john_tre@email.com',
          password: '000000',
        },
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateProfile.run({
        user_id: id,
        profile_data: {
          name: 'John Tre',
          email: 'john_tre@email.com',
          password: '000000',
        },
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty(
        'message',
        'To update your password, you must provide your old password.'
      );
    }
  });

  it('should not be able to update the password if the old password is incorrect', async () => {
    const compareHash = jest.spyOn(fakeHashProvider, 'compareHash');

    const { id } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.run({
        user_id: id,
        profile_data: {
          name: 'John Tre',
          email: 'john_tre@email.com',
          old_password: 'incorrect-old-password',
          password: '000000',
        },
      })
    ).rejects.toBeInstanceOf(AppError);

    expect(compareHash).toHaveBeenCalledWith({
      payload: 'incorrect-old-password',
      hash: '123456',
    });

    try {
      await updateProfile.run({
        user_id: id,
        profile_data: {
          name: 'John Tre',
          email: 'john_tre@email.com',
          old_password: 'incorrect-old-password',
          password: '000000',
        },
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 401);
      expect(error).toHaveProperty('message', 'Incorrect old password.');
    }
  });

  it('should not be able to update the email to one used for another user', async () => {
    await fakeUsersRepository.create({
      name: 'Jane Doe',
      email: 'jane_doe@email.com',
      password: '123456',
    });

    const { id, updated_at, created_at } = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await expect(
      updateProfile.run({
        user_id: id,
        profile_data: {
          name: 'John Tre',
          email: 'jane_doe@email.com',
        },
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      updateProfile.run({
        user_id: id,
        profile_data: {
          name: 'John Tre',
          email: 'john_doe@email.com',
        },
      })
    ).resolves.toEqual({
      id,
      name: 'John Tre',
      email: 'john_doe@email.com',
      password: '123456',
      updated_at,
      created_at,
    });

    try {
      await updateProfile.run({
        user_id: id,
        profile_data: {
          name: 'John Tre',
          email: 'jane_doe@email.com',
        },
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty('message', 'Email already in use.');
    }
  });

  it('should not be able to update an user tha does not exist', async () => {
    await expect(
      updateProfile.run({
        user_id: 'non-existing-id',
        profile_data: {
          name: 'John Tre',
          email: 'john_tre@email.com',
        },
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await updateProfile.run({
        user_id: 'non-existing-id',
        profile_data: {
          name: 'John Tre',
          email: 'john_tre@email.com',
        },
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'User not found.');
    }
  });
});
