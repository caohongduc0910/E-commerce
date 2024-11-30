import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auths/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { OrderModule } from 'src/orders/order.module';

@Module({
  imports: [
    AuthModule,
    CloudinaryModule,
    OrderModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
