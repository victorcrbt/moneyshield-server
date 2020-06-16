import { container } from 'tsyringe';

import './providers/MailTemplateProvider';
import './providers/MailProvider';
import '@modules/users/providers/HashProvider';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/prisma/UsersRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
);
