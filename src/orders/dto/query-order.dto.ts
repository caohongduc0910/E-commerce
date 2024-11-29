import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { Status } from 'src/enums/status.enum';

export class QueryOrderDTO {
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

  @IsOptional()
  @IsEnum(Status)
  readonly status: Status;
}
