import {
  IsNotEmpty,
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsPhoneNumber,
  IsDate,
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

  @IsString()
  phone: string;

  @IsDate()
  dateOfBirth: Date;

  @IsString()
  address: string;
}
