import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';
import { Category, Tag } from 'src/enums/role.enum';

export class UpdateProductDTO {
  @IsNotEmpty({ message: 'title is required' })
  @IsString()
  readonly title: string;

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  readonly price: number;

  @IsNumber()
  readonly salePrice: number;

  @IsNotEmpty({ message: 'image is required' })
  @IsString()
  readonly image: string;

  @IsEnum(Category)
  readonly category: Category;

  @IsEnum(Tag)
  readonly tag: Tag;

  @IsNotEmpty({ message: 'vendor is required' })
  @IsString()
  readonly vendor: string;
}
