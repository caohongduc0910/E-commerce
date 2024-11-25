import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { Category, Tag } from 'src/enums/role.enum';

export class CreateProductDTO {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString()
  readonly title: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  readonly price: number;

  @IsNotEmpty({ message: 'Email is required' })
  @IsNumber()
  readonly salePrice: number;

  @IsNotEmpty({ message: 'Image is required' })
  @IsString()
  readonly image: string;

  @IsEnum(Category)
  readonly category: Category

  @IsEnum(Tag)
  readonly tag: Tag

}
