import { container } from 'tsyringe';

import IMailTemplateProvider from './models/IMailTemplateProvider';
import HandlebarsTemplateProvider from './implementations/HandlebarsTemplateProvider';

const provider = {
  handlebars: HandlebarsTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  provider.handlebars
);
