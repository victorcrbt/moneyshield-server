import { injectable, inject } from 'tsyringe';
import { ForgotPasswordToken } from '@prisma/client';
import path from 'path';

import AppError from '@shared/error/AppError';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IForgotPasswordTokenRepository from '../repositories/IForgotPasswordTokenRepository';

interface IRequestDTO {
  email: string;
}

@injectable()
export default class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ForgotPasswordTokenRepository')
    private forgotPasswordTokenRepository: IForgotPasswordTokenRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  public async run({ email }: IRequestDTO): Promise<ForgotPasswordToken> {
    const userExists = await this.usersRepository.findByEmail({ email });

    if (!userExists) {
      throw new AppError({
        status: 404,
        message: 'User not found.',
      });
    }

    const token = await this.forgotPasswordTokenRepository.create({
      client_id: userExists.id,
    });

    const templatePath = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs'
    );

    await this.mailProvider.sendMail({
      to: {
        email: userExists.email,
        name: userExists.name,
      },
      subject: 'Recuperação de senha',
      templateData: {
        file: templatePath,
        variables: {
          name: userExists.name,
          link: `${process.env.FRONTEND_URL}?token=${token.content}`,
        },
      },
    });

    return token;
  }
}
