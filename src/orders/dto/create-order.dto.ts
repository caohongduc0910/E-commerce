import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Color } from 'src/enums/color.enum';
import { Size } from 'src/enums/size.enum';
import { Delivery } from 'src/enums/delivery.enum';

class ProductDTO {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsString()
  readonly productId: string;

  @IsNotEmpty({ message: 'Color is required' })
  @IsEnum(Color, { message: 'Invalid color' })
  readonly color: Color;

  @IsOptional()
  @IsEnum(Size, { message: 'Invalid size' })
  readonly size: Size;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber()
  readonly quantity: number;
}

export class CreateOrderDTO {
  @IsNotEmpty({ message: 'Products are required' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductDTO)
  readonly products: ProductDTO[];

  @IsNotEmpty({ message: 'delivery_option is required' })
  @IsEnum(Delivery)
  readonly delivery_option: Delivery;
}
