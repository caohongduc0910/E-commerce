import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyValidationPipe } from './common/validates/validation.pipe';
import { ValidationExceptionFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.useGlobalPipes(new MyValidationPipe());
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
