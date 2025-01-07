import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { AuthModule } from './auths/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { BullModule } from '@nestjs/bull';
import { ProductModule } from './products/product.module';
import { OrderModule } from './orders/order.module';
import { StripeModule } from './stripe/stripe.module';
import { NotificationModule } from './notifications/notification.module';
import { WalletModule } from './wallets/wallet.module';
import { TransactionModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      }),
    }),
    UserModule,
    ProductModule,
    AuthModule,
    MailerModule,
    OrderModule,
    StripeModule,
    NotificationModule,
    WalletModule,
    TransactionModule,
  ],
})
export class AppModule {}
