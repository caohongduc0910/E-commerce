import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auths/auth.module';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from 'src/products/product.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Product, ProductSchema } from 'src/products/schemas/product.schema';
import { StripeModule } from 'src/stripe/stripe.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    StripeModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
