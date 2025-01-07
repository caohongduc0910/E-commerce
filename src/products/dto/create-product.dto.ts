import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Category } from 'src/enums/category.enum';
import { Collection } from 'src/enums/collection.enum';
import { Vendor } from 'src/enums/vendor.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDTO {
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsNotEmpty({ message: 'price is required' })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  readonly salePrice: number;

  @IsNotEmpty({ message: 'category is required' })
  @IsEnum(Category)
  readonly category: Category;

  @IsNotEmpty({ message: 'Collection is required' })
  @IsEnum(Collection)
  readonly collection: Collection;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    value ? value.split(',').map((tag) => tag.trim()) : [],
  )
  readonly tags: string[];

  @IsNotEmpty({ message: 'vendor is required' })
  @IsEnum(Vendor)
  readonly vendor: Vendor;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Ảnh sản phẩm',
  })
  @IsOptional()
  readonly image?: any;
}
