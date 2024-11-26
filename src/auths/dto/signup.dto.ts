import { IsNotEmpty, IsEmail, IsString, IsUUID, IsDate, IsOptional, MinLength, MaxLength, Matches} from 'class-validator';

export class SignUpDTO {
  @IsNotEmpty({ message: 'first name is required' })
  @IsString()
  readonly firstName: string;

  @IsNotEmpty({ message: 'last name is required' })
  @IsString()
  readonly lastName: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'invalid email format' })
  email: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters long' })
  @MaxLength(20, { message: 'password must not exceed 20 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'password must include uppercase, lowercase, number, and special character',
  })
  password: string;

  @IsOptional()
  @IsUUID()
  codeId: string;

  @IsOptional()
  @IsDate()
  codeIdExpiresAt: Date;

  @IsNotEmpty({ message: 'confirm password is required' })
  @IsString()
  cfPassword: string;
}
