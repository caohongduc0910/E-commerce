import { Module } from '@nestjs/common';
import { OTPService } from './otp.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OTPSchema } from './schemas/otp.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'OTP', schema: OTPSchema }])],
  providers: [OTPService],
  exports: [OTPService],
})
export class OTPModule {}
