import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PinEntity } from './entities/pin.entity';
import { RouteEntity } from './entities/route.entity';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  //routes 모듈 내에서 사용할 저장소를 등록한다.
  imports: [TypeOrmModule.forFeature([RouteEntity, PinEntity])],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
