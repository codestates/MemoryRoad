import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { swaggerUi, swaggerSpec } from './swaggerDoc';
import express from 'express';
import { join } from 'path';
import 'reflect-metadata';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

async function bootstrap() {
  initializeTransactionalContext(); // Initialize cls-hooked
  patchTypeORMRepositoryWithBaseRepository(); // patch Repository with BaseRepository. 레포지토리가 BaseRepository를 상속해 사용하지 않고, typeorm repository(https://github.com/typeorm/typeorm/blob/master/src/repository/Repository.ts)를 사용하는 경우 이 메소드를 사용한다.
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
