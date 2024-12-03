import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyValidationPipe } from './common/validates/validation.pipe';
import { ValidationExceptionFilter } from './common/filters/exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new MyValidationPipe());
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
