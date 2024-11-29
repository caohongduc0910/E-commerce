import { Injectable } from '@nestjs/common';
import { OTP } from './schemas/otp.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Injectable()
export class OTPService {
  constructor(
    @InjectModel(OTP.name)
    private otpModel: mongoose.Model<OTP>,
  ) {}
  async create(email: string, otp: string, expirationTime: Date): Promise<any> {
    const result = await this.otpModel.create({
      otp: otp,
      email: email,
      expiresAt: expirationTime,
    });

    return result;
  }

  async findByOtp(otp: string): Promise<any> {
    const existOTP = await this.otpModel.findOne({
      otp: otp,
    });
    return existOTP;
  }
}
