import 'reflect-metadata';
import { User, ForgotPasswordToken } from '@prisma/client';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/error/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeForgotPasswordTokenRepository from '../repositories/fakes/FakeForgotPasswordTokenRepository';

import ResetPasswordService from './ResetPasswordService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let fakeForgotPasswordTokenRepository: FakeForgotPasswordTokenRepository;

let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    fakeForgotPasswordTokenRepository = new FakeForgotPasswordTokenRepository();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeForgotPasswordTokenRepository,
      fakeHashProvider
    );
  });

  it('should be able to reset the user password', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    let user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    let token = await fakeForgotPasswordTokenRepository.create({
      client_id: user.id,
    });

    await resetPassword.run({
      token: token.content,
      password: '000000',
    });

    user = (await fakeUsersRepository.findByID({ user_id: user.id })) as User;
    token = (await fakeForgotPasswordTokenRepository.findByContent({
      content: token.content,
    })) as ForgotPasswordToken;

    expect(generateHash).toHaveBeenCalledWith({ payload: '000000' });
    expect(user.password).toEqual('000000');
    expect(token).toBeNull();
  });

  it('should not be able to update the password if the token is expired', async () => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 5, 20, 10, 0, 0).getTime());

    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const token = await fakeForgotPasswordTokenRepository.create({
      client_id: user.id,
    });

    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2020, 5, 21, 11, 0, 0).getTime());

    await expect(
      resetPassword.run({
        token: token.content,
        password: '000000',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await resetPassword.run({
        token: token.content,
        password: '000000',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 403);
      expect(error).toHaveProperty('message', 'The provided token is expired.');
    }
  });

  it('should return an error if there is no matching token', async () => {
    await expect(
      resetPassword.run({
        token: 'non-existing-token',
        password: '000000',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await resetPassword.run({
        token: 'non-existing-token',
        password: '000000',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'Token not found.');
    }
  });

  it('should return an error if there is not matching user', async () => {
    const token = await fakeForgotPasswordTokenRepository.create({
      client_id: 'non-existing-user',
    });

    await expect(
      resetPassword.run({
        token: token.content,
        password: '000000',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await resetPassword.run({
        token: token.content,
        password: '000000',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'User not found.');
    }
  });
});
