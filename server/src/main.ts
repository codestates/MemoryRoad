import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { swaggerUi, swaggerSpec } from './swaggerDoc';
import express from 'express';
import { join } from 'path';

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

  //사진이 저장된 정적 파일 경로 지정
  app.use('/upload', express.static(join(__dirname, '../upload')));
  app.use(cookieParser());
  //스웨거 적용을 위한 전역 미들웨어
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  await app.listen(80);
}
bootstrap();
