import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Product } from 'src/common/interfaces/product.interface';
import { Delivery } from 'src/enums/delivery.enum';
import { Status } from 'src/enums/status.enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
})
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: User;

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
