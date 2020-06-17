import { uuid } from 'uuidv4';

import IMailProvider from '../models/IMailProvider';

import ISendMailDTO from '../dtos/ISendMailDTO';

interface IMail {
  id: string;
  subject: string;
  content: string;
}

export default class FakeMailProvider implements IMailProvider {
  private mails: IMail[] = [];

  public async sendMail({ subject, content }: ISendMailDTO): Promise<void> {
    const mail = {
      id: uuid(),
      subject,
      content,
    } as IMail;

    this.mails.push(mail);
  }

  public async getMails(): Promise<IMail[]> {
    return this.mails;
  }
}
