import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AllExceptionsFilter } from './interceptors/all-exception-filter.interceptor';
import { ResponseMessageInterceptor } from './interceptors/response-message.interceptor';

const logger = new Logger('SYSTEM');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'verbose', 'warn'],
  });

  const corsOrigin = [
    'http://localhost:4000',
    'http://127.0.0.1:4000',
    'http://localhost:8000',
  ];

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const reflector = app.get(Reflector);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseMessageInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const port = process.env.PORT || 8889;

  await app.listen(port, () => console.log(`App is running on port ${port}`));
  logger.verbose('Hệ thống đang chạy ở cổng ' + port);
}

try {
  bootstrap().catch((err) => {
    logger.error(err, err.stack);
  });
} catch (err) {
  logger.error(err, err.stack);
}
