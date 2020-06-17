import { container } from 'tsyringe';

import './providers/MailTemplateProvider';
import './providers/MailProvider';
import '@modules/users/providers/HashProvider';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/prisma/UsersRepository';

import IForgotPasswordTokenRepository from '@modules/users/repositories/IForgotPasswordTokenRepository';
import ForgotPasswordTokenRepository from '@modules/users/infra/prisma/ForgotPasswordTokenRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IForgotPasswordTokenRepository>(
  'ForgotPasswordTokenRepository',
  ForgotPasswordTokenRepository
);
