import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsDate,
  IsOptional,
} from 'class-validator';

export class UpdateUserDTO {
  @IsNotEmpty({ message: 'first name is required' })
  @IsString()
  readonly firstName: string;

  @IsNotEmpty({ message: 'last name is required' })
  @IsString()
  readonly lastName: string;

  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'invalid email format' })
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsDate()
  dateOfBirth: Date;

  @IsOptional()
  @IsString()
  address: string;
}
