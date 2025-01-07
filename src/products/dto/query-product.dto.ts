import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQueryDTO } from 'src/common/dtos/base-search.dto';
import { Category } from 'src/enums/category.enum';
import { Vendor } from 'src/enums/vendor.enum';
import { Collection } from 'src/enums/collection.enum';

export class QueryProductDTO extends BaseQueryDTO {
  @ApiPropertyOptional({
    enum: Category,
    example: Category.BOTTOMWEAR,
  })
  @IsOptional()
  @IsString()
  @IsEnum(Category)
  readonly category: string;

  @ApiPropertyOptional({
    enum: Vendor,
    example: Vendor.BOSCH,
  })
  @IsOptional()
  @IsString()
  @IsEnum(Vendor)
  readonly vendor: string;

  @ApiPropertyOptional({
    enum: Collection,
    example: Collection.MEN,
  })
  @IsOptional()
  @IsString()
  @IsEnum(Collection)
  readonly collection: string;
}
