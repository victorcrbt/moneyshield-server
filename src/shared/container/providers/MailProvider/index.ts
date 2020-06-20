import { container } from 'tsyringe';

import IMailProvider from './models/IMailProvider';
import MailtrapProvider from './implementations/MailtrapProvider';

const provider = {
  mailtrap: MailtrapProvider,
};

container.registerSingleton<IMailProvider>('MailProvider', provider.mailtrap);
