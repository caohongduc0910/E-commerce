/* eslint-disable prettier/prettier */
import {
    IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class VerifyDTO {
  @IsNotEmpty({ message: 'email is required' })
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty({ message: 'codeId is required' })
  @IsString()
  @IsUUID()
  readonly codeId: string
}
