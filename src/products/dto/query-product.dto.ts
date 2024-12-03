import { IsOptional, IsString } from 'class-validator';
import { BaseQueryDTO } from 'src/common/dtos/base-search.dto';

export class QueryProductDTO extends BaseQueryDTO {
  @IsOptional()
  @IsString()
  readonly category: string;

  @IsOptional()
  @IsString()
  readonly vendor: string;

  @IsOptional()
  @IsString()
  readonly collection: string;
}
