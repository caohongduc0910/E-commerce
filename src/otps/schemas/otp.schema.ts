import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OTPDocument = HydratedDocument<OTP>;

@Schema({
  timestamps: true,
})
export class OTP {
  @Prop({ unique: true })
  otp: string;

  @Prop()
  email: string;

  @Prop({ type: Date, expires: 60 })
  expiresAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
