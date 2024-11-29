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
  delivery_option: Delivery;

  @Prop()
  subtotal: number;

  @Prop()
  discount: number;

  @Prop()
  tax: number;

  @Prop()
  delivery_fee: number;

  @Prop()
  total: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
