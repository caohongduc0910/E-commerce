import { Color } from 'src/enums/color.enum';
import { Size } from 'src/enums/size.enum';

export interface Product {
  productId: string;
  color: Color;
  size: Size;
  quantity: number;
  subtotal: number;
}
