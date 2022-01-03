import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { swaggerUi, swaggerSpec } from './swaggerDoc';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //스웨거 적용을 위한 전역 미들웨어
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  await app.listen(80);
}
bootstrap();
