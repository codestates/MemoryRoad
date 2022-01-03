import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { swaggerUi, swaggerSpec } from './swaggerDoc';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.use(cookieParser());
  //스웨거 적용을 위한 전역 미들웨어
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  await app.listen(80);
}
bootstrap();
