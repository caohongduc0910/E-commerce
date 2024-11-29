import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auths/auth.module';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ProductModule } from 'src/products/product.module';
import { User, UserSchema } from 'src/users/schemas/user.schema';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
