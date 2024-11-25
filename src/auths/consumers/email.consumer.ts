import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailService } from 'src/mails/mail.service';

@Processor('emailSending')
export class EmailConsumer {
  constructor(private mailService: MailService) {}
  @Process('register')
  async registerEmail(job: Job<any>) {
    this.mailService.sendVerificationCode(job.data.email, job.data.codeID);
  }
  @Process('passwordForget')
  async forgetPassword(job: Job<any>) {
    this.mailService.sendOTP(job.data.email, job.data.otp)
  }
}
