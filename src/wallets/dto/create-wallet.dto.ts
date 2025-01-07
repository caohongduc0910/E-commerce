import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWalletDTO {
  @IsNotEmpty({ message: 'address is required' })
  @IsString()
  readonly address: string;
}
