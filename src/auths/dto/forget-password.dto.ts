/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDTO {
  @IsNotEmpty({ message: 'email is required' })
  @IsString()
  @IsEmail()
  readonly email: string;
}
