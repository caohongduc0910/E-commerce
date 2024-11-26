import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auths/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
