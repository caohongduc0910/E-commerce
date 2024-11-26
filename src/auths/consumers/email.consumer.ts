import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAMES } from 'src/common/constants/queue.constant';
import { MailService } from 'src/mails/mail.service';

@Processor(QUEUE_NAMES.EMAIL)
export class EmailConsumer {
  constructor(private mailService: MailService) {}
  @Process(QUEUE_NAMES.REGISTER)
  async registerEmail(job: Job<any>) {
    const { email, codeID } = job.data;
    this.mailService.sendVerificationCode(email, codeID);
  }
  @Process(QUEUE_NAMES.FORGET)
  async forgetPassword(job: Job<any>) {
    const { email, otp } = job.data;
    this.mailService.sendOTP(email, otp);
  }
}
