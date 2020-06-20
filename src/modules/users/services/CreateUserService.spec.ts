import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/error/AppError';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createUser: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it('should be able to create a new user', async () => {
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    const user = await createUser.run({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(generateHash).toHaveBeenCalledWith({ payload: '123456' });
  });

  it('should not be able to create user with duplicated email', async () => {
    await createUser.run({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await expect(
      createUser.run({
        name: 'John Doe',
        email: 'john_doe@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await createUser.run({
        name: 'John Doe',
        email: 'john_doe@email.com',
        password: '123456',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 400);
      expect(error).toHaveProperty('message', 'Email already in use.');
    }
  });
});
