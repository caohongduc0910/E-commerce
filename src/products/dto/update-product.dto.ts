import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { Category } from 'src/enums/category.enum';
import { Tag } from 'src/enums/tag.enum';

export class UpdateProductDTO {
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  readonly title: string;

  @IsNotEmpty({ message: 'price is required' })
  // @IsNumber()
  readonly price: number;

  // @IsNumber()
  readonly salePrice: number;

  @IsEnum(Category)
  readonly category: Category;

  @IsEnum(Tag)
  readonly tag: Tag;

  @IsNotEmpty({ message: 'vendor is required' })
  @IsString()
  readonly vendor: string;
}
