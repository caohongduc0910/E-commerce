import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyValidationPipe } from './common/validates/validation.pipe';
import { ValidationExceptionFilter } from './common/filters/exception.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    bodyParser.json({
      verify: function (req: any, res, buf) {
        const url = req.originalUrl;
        if (url.startsWith('/api/stripe/webhook')) {
          req.rawBody = buf.toString();
        }
        return true;
      },
    }),
  );
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new MyValidationPipe());
  app.useGlobalFilters(new ValidationExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
