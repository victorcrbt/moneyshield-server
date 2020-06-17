import 'dotenv/config';
import 'reflect-metadata';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeForgotPasswordTokenRepository from '@modules/users/repositories/fakes/FakeForgotPasswordTokenRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import AppError from '@shared/error/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeForgotPasswordTokenRepository: FakeForgotPasswordTokenRepository;

let fakeMailProvider: FakeMailProvider;

let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeForgotPasswordTokenRepository = new FakeForgotPasswordTokenRepository();

    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeForgotPasswordTokenRepository,
      fakeMailProvider
    );
  });

  it('should be able to generate a new forgot password token', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john_doe@email.com',
      password: '123456',
    });

    const token = await sendForgotPasswordEmail.run({
      email: 'john_doe@email.com',
    });

    expect(sendMail).toHaveBeenCalled();

    expect(token).toHaveProperty('id');
    expect(token.content).toBeDefined();
  });

  it('should return an error if there is no user with the provided email', async () => {
    await expect(
      sendForgotPasswordEmail.run({
        email: 'john_doe@email.com',
      })
    ).rejects.toBeInstanceOf(AppError);

    try {
      await sendForgotPasswordEmail.run({
        email: 'john_doe@email.com',
      });
    } catch (error) {
      expect(error).toHaveProperty('status', 404);
      expect(error).toHaveProperty('message', 'User not found.');
    }
  });
});
