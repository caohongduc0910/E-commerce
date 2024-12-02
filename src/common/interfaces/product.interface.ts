import { Color } from 'src/enums/color.enum';
import { Size } from 'src/enums/size.enum';

export interface Product {
  productId: string;
  image: string;
  title: string;
  category: string;
  color: Color;
  size: Size;
  quantity: number;
  subtotal: number;
}
