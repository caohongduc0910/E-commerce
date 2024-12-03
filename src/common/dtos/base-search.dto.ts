import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class BaseQueryDTO {
  @IsOptional()
  @IsString()
  readonly keyword: string;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 5))
  @IsNumber()
  readonly limit: number;

  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsNumber()
  readonly page: number;

  @IsOptional()
  @IsString()
  readonly sortKey: string;

  @IsOptional()
  @IsString()
  readonly sortValue: string;
}
