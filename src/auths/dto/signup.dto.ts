import { IsNotEmpty, IsEmail, IsString, IsUUID, IsDate } from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  readonly firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  readonly lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString()
  password: string;

  @IsUUID()
  codeId: string;

  @IsDate()
  codeIdExpiresAt: Date;

  @IsNotEmpty({ message: 'Confirm Password is required' })
  @IsString()
  cfPassword: string;
}
