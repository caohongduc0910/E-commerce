import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyValidationPipe } from './common/validates/validation.pipe';
import { ValidationExceptionFilter } from './common/filters/exception.filter';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Ecommerce Training')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', // Tên này sẽ được sử dụng khi gắn security
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(
    bodyParser.json({
      verify: function (req: any, res, buf) {
        const url = req.originalUrl;
        console.log(url);
        if (url.startsWith('/api/v1/webhook')) {
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
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
