import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouteEntity } from './entities/route.entity';

@Injectable()
export class RoutesService {
  //routes 레포지토리 주입
  constructor(
    @InjectRepository(RouteEntity)
    private routesRepository: Repository<RouteEntity>,
  ) {}

  async getUserRoutes(page: number): Promise<object> {
    //TODO where문으로 해당 유저의 루트만 가져오기
    //루트의 createdAt, 핀의 ranking컬럼, 사진의 아이디 순으로 오름차순 정렬
    const routes = await this.routesRepository
      .createQueryBuilder('Routes')
      .leftJoinAndSelect('Routes.Pins', 'Pins')
      .leftJoinAndSelect('Pins.Pictures', 'Pictures')
      .select([
        'Routes.id',
        'Routes.userId',
        'Routes.routeName',
        'Routes.description',
        'Routes.createdAt',
        'Routes.updatedAt',
        'Routes.public',
        'Routes.color',
        'Routes.time',
        'Pins.id',
        'Pins.ranking',
        'Pins.locationName',
        'Pictures.fileName',
      ])
      .orderBy('Routes.createdAt')
      .addOrderBy('Pins.ranking')
      .addOrderBy('Pictures.id')
      .getMany();

    //count는 총 루트의 개수
    //페이지네이션을 위해 8개씩 나누어 보낸다
    const response = {
      code: 200,
      routes: routes.slice(page * 8 - 8, page * 8),
      count: routes.length,
    };

    response.routes.forEach((route) => {
      let fileName = null;
      //핀들의 사진을 조회해서 가장 처음 사진을 대표 사진으로 한다.
      for (let i = 0; i < route.Pins.length; i++) {
        if (!route.Pins[i].Pictures.length) continue;
        if (route.Pins[i].Pictures.length !== 0) {
          fileName = route.Pins[i].Pictures[0].fileName;
          break;
        }
      }

      route['thumbnail'] = fileName;
    });
    return response;
  }
}
