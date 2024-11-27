import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Category, Tag } from 'src/enums/role.enum';

export class CreateProductDTO {
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  readonly title: string;

  @IsNotEmpty({ message: 'price is required' })
  // @IsNumber()
  readonly price: number;

  @IsNotEmpty({ message: 'sale price is required' })
  // @IsNumber()
  readonly salePrice: number;

  // @IsNotEmpty({ message: 'image is required' })
  // @IsString()
  // readonly image: string;

  @IsNotEmpty({ message: 'category is required' })
  @IsEnum(Category)
  readonly category: Category

  @IsNotEmpty({ message: 'tag is required' })
  @IsEnum(Tag)
  readonly tag: Tag

  @IsNotEmpty({ message: 'vendor is required' })
  @IsString()
  readonly vendor: string;
}
