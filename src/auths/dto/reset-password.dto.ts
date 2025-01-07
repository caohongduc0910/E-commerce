/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty({ message: 'otp is required' })
  @IsString()
  readonly otp: string;

  @IsNotEmpty({ message: 'new password is required' })
  @IsString()
  readonly password: string;
}
