import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum } from 'class-validator';
import { BaseQueryDTO } from 'src/common/dtos/base-search.dto';
import { Status } from 'src/enums/status.enum';

export class QueryOrderDTO extends BaseQueryDTO {
  @ApiPropertyOptional({
    enum: Status,
    example: Status.PENDING,
  })
  @IsOptional()
  @IsEnum(Status)
  readonly status: Status;
}
