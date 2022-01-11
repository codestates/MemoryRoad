import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { PictureEntity } from './entities/picture.entity';
import { PinEntity } from './entities/pin.entity';
import { PlaceKeywordEntity } from './entities/placeKeyword.entity';
import { RouteEntity } from './entities/route.entity';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';

@Module({
  //routes 모듈 내에서 사용할 저장소를 등록한다.
  imports: [
    TypeOrmModule.forFeature([
      RouteEntity,
      PinEntity,
      PictureEntity,
      UserEntity,
      PlaceKeywordEntity,
    ]),
  ],
  controllers: [RoutesController],
  providers: [RoutesService, UsersService],
})
export class RoutesModule {}
