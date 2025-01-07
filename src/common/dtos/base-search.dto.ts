import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseQueryDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly keyword: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 5))
  @IsNumber()
  readonly limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : 1))
  @IsNumber()
  readonly page: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly sortKey: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly sortValue: string;
}
