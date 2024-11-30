import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Product } from 'src/common/interfaces/product.interface';
import { Delivery } from 'src/enums/delivery.enum';
import { Status } from 'src/enums/status.enum';
export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
})
export class Order {
  @Prop()
  userId: string;

  @Prop()
  name: string;

  @Prop({ type: Array, default: [] })
  products: Product[];

  @Prop({ default: Status.PENDING })
  status: Status;

  @Prop()
  deliveryOption: Delivery;

  @Prop()
  subtotal: number;

  @Prop()
  discount: number;

  @Prop()
  tax: number;

  @Prop()
  deliveryFee: number;

  @Prop()
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
