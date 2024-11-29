import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Category } from 'src/enums/category.enum';
import { Tag } from 'src/enums/tag.enum';
import { Vendor } from 'src/enums/vendor.enum';

export class CreateProductDTO {
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  readonly title: string;

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

  @IsNotEmpty({ message: 'tag is required' })
  @IsEnum(Tag)
  readonly tag: Tag;

  @IsNotEmpty({ message: 'vendor is required' })
  @IsEnum(Vendor)
  readonly vendor: Vendor;
}
