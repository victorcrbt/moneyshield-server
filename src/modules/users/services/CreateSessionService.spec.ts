import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/error/AppError';

import CreateSessionService from './CreateSessionService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let createSession: CreateSessionService;

describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createSession = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider
    );
  });

  it('should be able to create a new session', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const session = await createSession.run({
      email: 'john_doe@email.com',
      password: '123456',
    });

    expect(session).toHaveProperty('token');
    expect(session).toHaveProperty('user');
    expect(session.user).toHaveProperty('id');
  });

  it('should not be able to authenticate with an email that does not exist', async () => {
    await expect(
      createSession.run({
        email: 'john_doe@email.com',
        password: '123456',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await createSession.run({
        email: 'john_doe@email.com',
        password: '123456',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 401);
      expect(error).toHaveProperty('message', 'Invalid credentials.');
    }
  });

  it('should not be able to authenticate with an incorrect password', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    await expect(
      createSession.run({
        email: 'john_doe@email.com',
        password: 'incorrect-password',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await createSession.run({
        email: 'john_doe@email.com',
        password: 'incorrect-password',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 401);
      expect(error).toHaveProperty('message', 'Invalid credentials.');
    }
  });
});
