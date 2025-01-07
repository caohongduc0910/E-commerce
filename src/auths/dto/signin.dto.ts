import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @ApiProperty({
    example: 'caohongduc0910@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    example: '123',
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
