import { createTransport, Transporter } from 'nodemailer';

import IMailProvider from '../models/IMailProvider';

import ISendMailDTO from '../dtos/ISendMailDTO';

export default class MailtrapProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = createTransport({
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '673d33b7234e9c',
        pass: 'f24911af456c89',
      },
    });
  }

  public async sendMail({
    from,
    to,
    subject,
    content,
  }: ISendMailDTO): Promise<void> {
    await this.client.sendMail({
      from: {
        name: from?.name || 'Equipe MoneyShield',
        address: from?.email || 'noreply@moneyshield.com',
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      text: content,
    });
  }
}
