import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendVerificationCode(
    email: string,
    activationCode: string,
  ): Promise<any> {
    this.mailerService.sendMail({
      to: email,
      from: 'caohongvandz@gmail.com',
      subject: 'Activation Mail ✔',
      template: './register',
      context: {
        name: email,
        activationCode: activationCode,
      },
    });
  }

  async sendOTP(email: string, otp: string): Promise<any> {
    this.mailerService.sendMail({
      to: email,
      from: 'caohongvandz@gmail.com',
      subject: 'Reset Password Mail ✔',
      template: './forget-password',
      context: {
        name: email,
        otp: otp,
      },
    });
  }
}
