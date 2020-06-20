import { container } from 'tsyringe';

import './providers/MailTemplateProvider';
import './providers/MailProvider';
import '@modules/users/providers/HashProvider';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/prisma/UsersRepository';

import IForgotPasswordTokenRepository from '@modules/users/repositories/IForgotPasswordTokenRepository';
import ForgotPasswordTokenRepository from '@modules/users/infra/prisma/ForgotPasswordTokenRepository';

import ICashiersRepository from '@modules/cashiers/repositories/ICashiersRepository';
import CashiersRepository from '@modules/cashiers/infra/prisma/CashiersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);

container.registerSingleton<IForgotPasswordTokenRepository>(
  'ForgotPasswordTokenRepository',
  ForgotPasswordTokenRepository
);

container.registerSingleton<ICashiersRepository>(
  'CashiersRepository',
  CashiersRepository
);
