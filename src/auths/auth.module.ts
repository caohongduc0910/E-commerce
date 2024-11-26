import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'src/mails/mail.module';
import { OTPModule } from 'src/otps/otp.module';
import { EmailConsumer } from './consumers/email.consumer';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAMES } from 'src/common/constants/queue.constant';

@Module({
  imports: [
    PassportModule,
    MailModule,
    OTPModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN'),
        signOptions: { expiresIn: configService.get<string>('JWT_AT_EXPIRE') },
      }),
    }),
    BullModule.registerQueue({
      name: QUEUE_NAMES.EMAIL,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    EmailConsumer,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
