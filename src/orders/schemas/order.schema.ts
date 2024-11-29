import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Color } from 'src/enums/color.enum';
import { Size } from 'src/enums/size.enum';
export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
})
export class Order {
  @Prop()
  userId: string;

  products: [
    {
      productId: string;
      color: Color,
      size: Size,
      quantity: Number;
    },
  ];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
