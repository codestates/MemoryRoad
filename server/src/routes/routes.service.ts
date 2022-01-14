import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { PatchPinDto } from './dto/patchPin.dto';
import { PatchRouteDto } from './dto/patchRoute.dto';
import { PostRouteDto } from './dto/postRoute.dto';
import { PictureEntity } from './entities/picture.entity';
import { PinEntity } from './entities/pin.entity';
import { RouteEntity } from './entities/route.entity';
import {
  isClosewithOther,
  isClosewithDB,
  redefineTooClose,
} from './routes.functions';
import fs from 'fs';
import { join } from 'path';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UsersService } from 'src/users/users.service';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PlaceKeywordEntity } from './entities/placeKeyword.entity';
import { PinsPlaceKeywordEntity } from './entities/pinsPlaceKeyword.entity';
import {
  runOnTransactionCommit,
  runOnTransactionRollback,
  Transactional,
} from 'typeorm-transactional-cls-hooked';

@Injectable()
export class RoutesService {
  //routes 레포지토리 주입
  constructor(
    @InjectRepository(RouteEntity)
    private routesRepository: Repository<RouteEntity>,
    @InjectRepository(PinEntity)
    private pinsRepository: Repository<PinEntity>,
    @InjectRepository(PictureEntity)
    private picturesRepository: Repository<PictureEntity>,
    private readonly usersService: UsersService,
    private configService: ConfigService,
    @InjectRepository(PlaceKeywordEntity)
    private placeKeywordsRepository: Repository<PlaceKeywordEntity>,
    @InjectRepository(PinsPlaceKeywordEntity)
    private pinsPlaceKeywordsRepository: Repository<PinsPlaceKeywordEntity>,
  ) {}

  async getUserRoutes(page: number, accessToken: string | undefined) {
    const decode = jwt.verify(
      accessToken,
      this.configService.get<string>('ACCESS_SECRET'),
    );

    //루트의 createdAt, 핀의 ranking컬럼, 사진의 아이디 순으로 오름차순 정렬
    const routes = await this.routesRepository
      .createQueryBuilder('Routes') //alias -> SELECT Routes as Routes
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
        'Pins.lotAddress',
        'Pins.roadAddress',
        'Pins.ward',
        'Pictures.fileName',
      ])
      .where('Routes.userId = :userId', { userId: decode['id'] })
      .orderBy('Routes.createdAt')
      .addOrderBy('Pins.ranking')
      .addOrderBy('Pictures.id')
      .getMany(); //여러 개의 결과를 가져온다. entity를 반환한다. getRawMany등으로 raw data를 가져올 수 있다.

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

  async getSearchedRoutes(
    nwLat: number,
    nwLng: number,
    seLat: number,
    seLng: number,
    rq?: string,
    lq?: string,
    location?: string,
    time?: number,
    page?: number,
  ) {
    //루트명, 장소명은 하나만 주어지거나 주어지지 않는다.
    if (!rq && !lq) {
      if (!nwLat || !nwLng || !seLat || !seLng) throw new BadRequestException();
      //위도, 경도 조건에 해당되는 핀들을 전부 가져온다.
      //rq, lq가 주어지지 않는 경우는 검색이 아니므로, 화면의 모든 루트를 보여줘야 한다. 페이지네이션을 하지 않는다.
      //공개된 루트 중 사진을 제외한 정보를 보내준다.
      const routes = await this.routesRepository
        .createQueryBuilder('Routes')
        .leftJoinAndSelect('Routes.Pins', 'Pins')
        .where(
          'Routes.public = 1 AND Pins.latitude BETWEEN :nwLat AND :seLat AND Pins.longitude BETWEEN :nwLng AND :seLng',
          { nwLat: nwLat, seLat: seLat, nwLng: nwLng, seLng: seLng },
        )
        .orderBy('Routes.createdAt')
        .addOrderBy('Pins.ranking')
        .getMany();

      const response = {
        code: 200,
        routes: routes,
      };

      return response;
    } else if (rq !== undefined) {
      //루트명이 주어질 경우
      //검색 시에는 페이지네이션을 위해 page파라미터가 반드시 주어져야 한다.
      //위도, 경도의 정보도 받아야 하는지?

      if (location === undefined && time === undefined) {
        //장소필터, 시간 필터가 둘 다 주어지지 않은 경우
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
            'Pins.lotAddress',
            'Pins.roadAddress',
            'Pins.ward',
            'Pictures.fileName',
          ])
          .where('Routes.public = 1 AND Routes.routeName LIKE :rq', {
            rq: `%${rq}%`,
          })
          .orderBy('Routes.createdAt')
          .addOrderBy('Pins.ranking')
          .addOrderBy('Pictures.id')
          .getMany();

        const response = {
          code: 200,
          routes: routes.slice(page * 5 - 5, page * 5),
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
      } else if (location !== undefined && time === undefined) {
        //장소필터만 주어진 경우. location과 일치하는 핀이 하나라도 있을 경우 해당 루트를 반환한다.

        //핀들을 '구'의 정보로 찾아서 루트의 아이디를 가져온다.
        const getIds = await this.pinsRepository
          .createQueryBuilder()
          .select(['routesId'])
          .distinct(true)
          .where('ward = :ward', { ward: location })
          .getRawMany();

        //중복이 제거된 루트의 아이디들
        const routeIds = [];
        getIds.forEach((obj) => routeIds.push(obj['routesId']));

        //일치하는 루트가 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (routeIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

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
            'Pins.lotAddress',
            'Pins.roadAddress',
            'Pins.ward',
            'Pictures.fileName',
          ])
          .where(
            'Routes.public = 1 AND Routes.routeName LIKE :rq AND Routes.id IN (:id)',
            {
              rq: `%${rq}%`,
              id: routeIds,
            },
          )
          .orderBy('Routes.createdAt')
          .addOrderBy('Pins.ranking')
          .addOrderBy('Pictures.id')
          .getMany();

        const response = {
          code: 200,
          routes: routes.slice(page * 5 - 5, page * 5),
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
      } else if (location === undefined && time !== undefined) {
        //시간필터만 주어진 경우
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
            'Pins.lotAddress',
            'Pins.roadAddress',
            'Pins.ward',
            'Pictures.fileName',
          ])
          .where(
            'Routes.public = 1 AND Routes.routeName LIKE :rq AND Routes.time = :time',
            {
              rq: `%${rq}%`,
              time: time,
            },
          )
          .orderBy('Routes.createdAt')
          .addOrderBy('Pins.ranking')
          .addOrderBy('Pictures.id')
          .getMany();

        const response = {
          code: 200,
          routes: routes.slice(page * 5 - 5, page * 5),
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
      } else {
        //필터가 전부 주어진 경우

        //핀들을 '구'의 정보로 찾아서 루트의 아이디를 가져온다.
        const getIds = await this.pinsRepository
          .createQueryBuilder()
          .select(['routesId'])
          .distinct(true)
          .where('ward = :ward', { ward: location })
          .getRawMany();

        //중복이 제거된 루트의 아이디들
        const routeIds = [];
        getIds.forEach((obj) => routeIds.push(obj['routesId']));

        //일치하는 루트가 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (routeIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

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
            'Pins.lotAddress',
            'Pins.roadAddress',
            'Pins.ward',
            'Pictures.fileName',
          ])
          .where(
            'Routes.public = 1 AND Routes.routeName LIKE :rq AND Routes.time = :time AND Routes.id IN (:id)',
            {
              rq: `%${rq}%`,
              time: time,
              id: routeIds,
            },
          )
          .orderBy('Routes.createdAt')
          .addOrderBy('Pins.ranking')
          .addOrderBy('Pictures.id')
          .getMany();

        const response = {
          code: 200,
          routes: routes.slice(page * 5 - 5, page * 5),
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
    } else {
      //키워드(lq)가 주어질 경우
      //키위드를 공백으로 구분한다
      //키워드와 전부 일치하는 핀이 속한 루트를 반환한다.
      const keywords = lq.split(' ');

      if (location === undefined && time === undefined) {
        //장소필터, 시간 필터가 둘 다 주어지지 않은 경우

        //pinId로 그룹을 지정한 뒤, 일차하는 키위드의 수가 들어있는 keywordCount컬럼을 만든다.
        const getPinIds = await this.pinsPlaceKeywordsRepository
          .createQueryBuilder('PPR')
          .where('PPR.keyword IN (:keywords)', { keywords: keywords })
          .addSelect('COUNT(PPR.keyword) AS keywordCount')
          .groupBy('PPR.pinId')
          .getRawMany();

        //주어진 키워드와 전부 일치하면(count 수와 키워드의 수가 같으면) 배열에 추가한다.
        const pinIds = [];
        getPinIds.forEach((obj) => {
          if (Number(obj['keywordCount']) === keywords.length) {
            pinIds.push(obj['PPR_pinId']);
          }
        });

        //일치하는 핀이 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (pinIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

        //핀들을 아이디의 정보로 찾아서 루트의 아이디를 가져온다.
        const getIds = await this.pinsRepository
          .createQueryBuilder()
          .select(['routesId'])
          .distinct(true)
          .where('id IN (:id)', { id: pinIds })
          .getRawMany();

        //중복이 제거된 루트의 아이디들
        const routeIds = [];
        getIds.forEach((obj) => routeIds.push(obj['routesId']));

        //일치하는 루트가 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (routeIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

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
            'Pins.lotAddress',
            'Pins.roadAddress',
            'Pins.ward',
            'Pictures.fileName',
          ])
          .where('Routes.public = 1 AND Routes.id IN (:routeIds)', {
            routeIds: routeIds,
          }) //raw 쿼리에 배열 넣을때 는 소괄호로 감싸자
          .orderBy('Routes.createdAt')
          .addOrderBy('Pins.ranking')
          .addOrderBy('Pictures.id')
          .getMany();

        const response = {
          code: 200,
          routes: routes.slice(page * 5 - 5, page * 5),
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
      } else if (location !== undefined && time === undefined) {
        //장소필터만 주어진 경우. location과 일치하는 핀이 하나라도 있을 경우 해당 루트를 반환한다.

        //pinId로 그룹을 지정한 뒤, 일차하는 키위드의 수가 들어있는 keywordCount컬럼을 만든다.
        const getPinIds = await this.pinsPlaceKeywordsRepository
          .createQueryBuilder('PPR')
          .where('PPR.keyword IN (:keywords)', { keywords: keywords })
          .addSelect('COUNT(PPR.keyword) AS keywordCount')
          .groupBy('PPR.pinId')
          .getRawMany();

        //주어진 키워드와 전부 일치하면(count 수와 키워드의 수가 같으면) 배열에 추가한다.
        const pinIds = [];
        getPinIds.forEach((obj) => {
          if (Number(obj['keywordCount']) === keywords.length) {
            pinIds.push(obj['PPR_pinId']);
          }
        });

        //일치하는 핀이 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (pinIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

        //핀들을 아이디, '구'의 정보로 찾아서 루트의 아이디를 가져온다.
        const getIds = await this.pinsRepository
          .createQueryBuilder()
          .select(['routesId'])
          .distinct(true)
          .where('id IN (:id) AND ward = :ward', { id: pinIds, ward: location })
          .getRawMany();

        //중복이 제거된 루트의 아이디들
        const routeIds = [];
        getIds.forEach((obj) => routeIds.push(obj['routesId']));

        //일치하는 루트가 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (routeIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

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
            'Pins.lotAddress',
            'Pins.roadAddress',
            'Pins.ward',
            'Pictures.fileName',
          ])
          .where('Routes.public = 1 AND Routes.id IN (:routeIds)', {
            routeIds: routeIds,
          }) //raw 쿼리에 배열 넣을때 는 소괄호로 감싸자
          .orderBy('Routes.createdAt')
          .addOrderBy('Pins.ranking')
          .addOrderBy('Pictures.id')
          .getMany();

        const response = {
          code: 200,
          routes: routes.slice(page * 5 - 5, page * 5),
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
      } else if (location === undefined && time !== undefined) {
        //시간 필터만 주어진 경우

        //pinId로 그룹을 지정한 뒤, 일차하는 키워드의 수가 들어있는 keywordCount컬럼을 만든다.
        const getPinIds = await this.pinsPlaceKeywordsRepository
          .createQueryBuilder('PPR')
          .where('PPR.keyword IN (:keywords)', { keywords: keywords })
          .addSelect('COUNT(PPR.keyword) AS keywordCount')
          .groupBy('PPR.pinId')
          .getRawMany();

        //주어진 키워드와 전부 일치하면(count 수와 키워드의 수가 같으면) 배열에 추가한다.
        const pinIds = [];
        getPinIds.forEach((obj) => {
          if (Number(obj['keywordCount']) === keywords.length) {
            pinIds.push(obj['PPR_pinId']);
          }
        });

        //일치하는 핀이 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (pinIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

        //핀들을 아이디, '구'의 정보로 찾아서 루트의 아이디를 가져온다.
        const getIds = await this.pinsRepository
          .createQueryBuilder()
          .select(['routesId'])
          .distinct(true)
          .where('id IN (:id)', { id: pinIds })
          .getRawMany();

        //중복이 제거된 루트의 아이디들
        const routeIds = [];
        getIds.forEach((obj) => routeIds.push(obj['routesId']));

        //일치하는 루트가 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (routeIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

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
            'Pins.lotAddress',
            'Pins.roadAddress',
            'Pins.ward',
            'Pictures.fileName',
          ])
          .where(
            'Routes.public = 1 AND Routes.time = :time AND Routes.id IN (:routeIds)',
            {
              time: time,
              routeIds: routeIds,
            },
          )
          .orderBy('Routes.createdAt')
          .addOrderBy('Pins.ranking')
          .addOrderBy('Pictures.id')
          .getMany();

        const response = {
          code: 200,
          routes: routes.slice(page * 5 - 5, page * 5),
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
      } else {
        //필터가 전부(구, 시간) 주어진 경우

        //pinId로 그룹을 지정한 뒤, 일차하는 키위드의 수가 들어있는 keywordCount컬럼을 만든다.
        const getPinIds = await this.pinsPlaceKeywordsRepository
          .createQueryBuilder('PPR')
          .where('PPR.keyword IN (:keywords)', { keywords: keywords })
          .addSelect('COUNT(PPR.keyword) AS keywordCount')
          .groupBy('PPR.pinId')
          .getRawMany();

        //주어진 키워드와 전부 일치하면(count 수와 키워드의 수가 같으면) 배열에 추가한다.
        const pinIds = [];
        getPinIds.forEach((obj) => {
          if (Number(obj['keywordCount']) === keywords.length) {
            pinIds.push(obj['PPR_pinId']);
          }
        });

        //일치하는 핀이 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (pinIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

        //핀들을 아이디, '구'의 정보로 찾아서 루트의 아이디를 가져온다.
        const getIds = await this.pinsRepository
          .createQueryBuilder()
          .select(['routesId'])
          .distinct(true)
          .where('id IN (:id) AND ward = :ward', { id: pinIds, ward: location })
          .getRawMany();

        //중복이 제거된 루트의 아이디들
        const routeIds = [];
        getIds.forEach((obj) => routeIds.push(obj['routesId']));

        //일치하는 루트가 없으면(검색결과가 없으면) 빈 배열을 반환한다.
        if (routeIds.length === 0) {
          return {
            code: 200,
            routes: [],
            count: 0,
          };
        }

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
            'Pins.lotAddress',
            'Pins.roadAddress',
            'Pins.ward',
            'Pictures.fileName',
          ])
          .where(
            'Routes.public = 1 AND Routes.time = :time AND Routes.id IN (:routeIds)',
            {
              time: time,
              routeIds: routeIds,
            },
          )
          .orderBy('Routes.createdAt')
          .addOrderBy('Pins.ranking')
          .addOrderBy('Pictures.id')
          .getMany();

        const response = {
          code: 200,
          routes: routes.slice(page * 5 - 5, page * 5),
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
  }

  // 핀을 추가하기 위해서는 새로 생성된 루트의 아이디가 필요하므로, 루트를 생성하고, 루트 아이디를 이용해 핀들을 생성한다.
  @Transactional() //open a transaction
  async createRoute(
    routeStr: string,
    files: Array<Express.Multer.File>,
    accessToken: string | undefined,
  ) {
    try {
      //트랜잭션이 롤백 됐을 때 실행되는 콜백 함수를 인자로 가지는 Hook. 메소드의 위치와 관계 없이 롤백이 일어나면 콜백 함수가 실행된다.
      runOnTransactionRollback((err) => {
        console.log('------Rollback------');
        console.log(err);
      });

      const decode = jwt.verify(
        accessToken,
        this.configService.get<string>('ACCESS_SECRET'),
      );

      //문자열 JSON을 parse한 뒤, PatchPinDto타입의 객체를 생성한다.
      const routePins = plainToClass(PostRouteDto, JSON.parse(routeStr));

      //새로 생성한 객체의 유효성 검증
      //유효하지 않은 키가 있으면 routeValError 배열에 추가된다.
      const routeValError = await validate(routePins, {
        forbidUnknownValues: true,
      });
      if (routeValError.length > 0) {
        const fstVal =
          routeValError[0].constraints[
            Object.keys(routeValError[0].constraints)[0]
          ];
        throw new BadRequestException(null, fstVal);
      }

      //PostRouteDto안 PatchPinDto 배열의 유효성 검증.
      //@Transfrom 데코레이터 안에서 타입 변환과 유효성 검증을 하려고 했지만 에러 catch를 하지 못해 여기서 에러 처리
      for (let i = 0; i < routePins.pins.length; i++) {
        const pinValError = await validate(routePins.pins[i], {
          forbidUnknownValues: true,
        });
        if (pinValError.length > 0) {
          const fstVal =
            pinValError[0].constraints[
              Object.keys(pinValError[0].constraints)[0]
            ];
          throw new BadRequestException(null, fstVal);
        }
      }

      //public은 예약어이다
      const { routeName, description, color, time } = routePins;
      const { pins } = routePins;
      const newRoute = await this.routesRepository.save({
        userId: decode['id'],
        routeName: routeName,
        description: description,
        public: routePins.public,
        color: color,
        time: time,
      });

      //주어진 핀들간의 거리를 계산해 tooClose프로퍼티를 추가한다.
      //tooClose프로퍼티가 추가되지 않는 경우, 디폴트 값인 '0'이 추가된다.
      isClosewithOther(pins);

      //db에 저장된 핀들과 저장하려는 핀들을 비교하기 위해 핀들의 위도, 경도를 불러온다. 개선 필요
      const dbPins = await this.pinsRepository
        .createQueryBuilder('Pins')
        .select(['Pins.id', 'Pins.latitude', 'Pins.longitude', 'Pins.tooClose'])
        .getMany();

      //인접한 점이 생긴 경우 DB에도 업데이트 해줘야 한다
      //추가하려는 점과 인점한 DB의 핀들. 이 핀들의 tooClose를 true로 업데이트 한다.
      let dbPinId: { id: number; tooClose: boolean }[] = [];

      pins.forEach((pin) => {
        dbPinId = Object.assign(dbPinId, isClosewithDB(dbPins, pin));
      });

      //DB핀들 업데이트 dbPinId가 빈 배열일 경우 실행되지 않는다.
      await this.pinsRepository.save(dbPinId);

      //키워드 테이블을 갱신하기 위한 객체
      const keywordObj = {};

      //pin각각에 routeId를 추가해 준다.
      pins.forEach((pin) => {
        pin['routesId'] = newRoute.id;
        let keywords = [];
        //기본값으로 구 정보 추가
        keywords.push(pin.ward);
        keywords = [...keywords, ...pin.keywords];

        keywordObj[pin.ranking] = keywords;
      });

      //새 핀들 생성
      //bulk insert
      const insertPinsResult = await this.pinsRepository.save(pins);

      //핀을 생성한 뒤, 핀의 아이디와 핀의 랭킹을 매칭하기 위한 객체
      const mapPinIdRanking = {};
      //병렬적으로 비동기 구문을 처리한다
      //forEach고차함수는 독립적인 함수를 생성하므로 안에서 await를 사용했을 경우 의도대로 동작하지 않을 수 있다.(https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop)
      await Promise.all(
        insertPinsResult.map(async (pin) => {
          mapPinIdRanking[pin.ranking] = pin.id;

          //키위드 테이블과 조인 테이블을 갱신한다.
          const keywords = [];
          //구의 정보를 기본 키워드로 넣는다.
          keywords.push({ keyword: pin.ward });
          for (let i = 0; i < pin.keywords.length; i++) {
            keywords.push({ keyword: pin.keywords[i] });
          }

          //키위드 업데이트의 결과
          const newKeywords = await this.placeKeywordsRepository.save(keywords);
          for (const obj of newKeywords) {
            obj['pinId'] = pin.id;
          }
          //jointable을 갱신한다.
          await this.pinsPlaceKeywordsRepository.save(newKeywords);
        }),
      );

      //사진들을 핀 별로 분리하기 위한 배열
      const eachPicture = [];
      files.forEach((file) => {
        if (!mapPinIdRanking[file.fieldname])
          throw new BadRequestException(null, 'Bad fieldname');
        eachPicture.push({
          pinId: mapPinIdRanking[file.fieldname],
          fileName: file.path,
        });
      });

      //사진 정보들 추가
      await this.picturesRepository.save(eachPicture);
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException();
      } else if (err.status === 400 || err instanceof SyntaxError) {
        throw new BadRequestException(null, err.message);
      } else if (err instanceof JsonWebTokenError) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Transactional() //open a transaction
  async updateRoute(
    routeId: number,
    route: PatchRouteDto,
    accessToken: string | undefined,
  ) {
    try {
      //트랜잭션이 롤백 됐을 때 실행되는 콜백 함수를 인자로 가지는 Hook. 메소드의 위치와 관계 없이 롤백이 일어나면 콜백 함수가 실행된다.
      runOnTransactionRollback((err) => {
        console.log('------Rollback------');
        console.log(err);
      });

      const decode = jwt.verify(
        accessToken,
        this.configService.get<string>('ACCESS_SECRET'),
      );
      //루트 아이디와 일치하는 요소 업데이트
      const result = await this.routesRepository
        .createQueryBuilder()
        .update('Routes')
        .set(route)
        .where('id = :id AND userId = :userId', {
          id: routeId,
          userId: decode['id'],
        })
        .execute();

      if (!result.affected) {
        //없는 루트, 또는 다른 유저가 작성한 루트를 업데이트 하려는 경우
        throw new UnauthorizedException();
      }
    } catch (err) {
      if (err.status === 401) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Transactional() //open a transaction
  async deleteRoute(routeId: number, accessToken: string | undefined) {
    try {
      //트랜잭션이 롤백 됐을 때 실행되는 콜백 함수를 인자로 가지는 Hook. 메소드의 위치와 관계 없이 롤백이 일어나면 콜백 함수가 실행된다.
      runOnTransactionRollback((err) => {
        console.log('------Rollback------');
        console.log(err);
      });

      const decode = jwt.verify(
        accessToken,
        this.configService.get<string>('ACCESS_SECRET'),
      );

      //루트를 지우기 전, 루트에 속한 사진들의 정보를 가져온다.
      const picturesInfo = await this.picturesRepository
        .createQueryBuilder('Pictures')
        .leftJoinAndSelect('Pictures.Pins', 'Pins')
        .leftJoinAndSelect('Pins.Routes', 'Routes')
        .select(['Pictures.fileName'])
        .where('Routes.id = :routeId', { routeId: routeId })
        .getMany();

      //루트 삭제. 테이블의 ondelete cascade제약으로 루트를 참조하는 핀, 사진들도 같이 삭제된다.
      const result = await this.routesRepository
        .createQueryBuilder()
        .delete()
        .from('Routes')
        .where('id = :id AND userId = :userId', {
          id: routeId,
          userId: decode['id'],
        })
        .execute();

      if (!result.affected) {
        //없는 루트, 또는 다른 유저가 작성한 루트를 삭제 하려는 경우
        throw new UnauthorizedException();
      }

      //사진 파일 삭제
      for (let i = 0; i < picturesInfo.length; i++) {
        //동기적으로 파일 삭제
        fs.unlinkSync(
          `${join(__dirname, '..', '..', '..')}/${picturesInfo[i].fileName}`,
        );
      }

      //tooClose 칼럼 갱신
      const dbPins = await this.pinsRepository
        .createQueryBuilder('Pins')
        .select(['Pins.id', 'Pins.latitude', 'Pins.longitude', 'Pins.tooClose'])
        .getMany();
      const updatePinInfoId = redefineTooClose(dbPins);
      await this.pinsRepository.save(updatePinInfoId);
    } catch (err) {
      if (err.status === 401) {
        throw err;
      } else {
        //테이블의 정보는 삭제 되더라도 실제 파일이 없는 경우 이 에러가 발생한다. (테이블에서는 삭제 처리된다.)
        throw new InternalServerErrorException();
      }
    }
  }

  async getPins(
    routeId: number,
    accessToken: string | undefined,
  ): Promise<PinEntity[]> {
    try {
      const decode = jwt.verify(
        accessToken,
        this.configService.get<string>('ACCESS_SECRET'),
      );

      //빈 배열이 나오는 경우 -> 없는 루트를 조회하거나, 자기가 저장하지 않은 루트를 조회 또는 핀이 저장되지 않은 루트를 저장하는 경우 -> 응답방식 생각해 보기
      const pins = await this.pinsRepository
        .createQueryBuilder('Pins') //alias -> SELECT Pins as Pins
        .leftJoinAndSelect('Pins.Pictures', 'Pictures')
        .leftJoin('Pins.Routes', 'Routes')
        .where('Pins.routesId = :id AND Routes.userId = :userId', {
          id: routeId,
          userId: decode['id'],
        })
        .orderBy('Pins.ranking')
        .addOrderBy('Pictures.id')
        .getMany(); //여러 개의 결과를 가져온다. entity를 반환한다. getRawMany등으로 raw data를 가져올 수 있다.

      return pins;
    } catch (err) {
      throw err;
    }
  }

  @Transactional() //open a transaction
  async updatePin(
    routeId: number,
    pinId: number,
    pinStr: string,
    files: Array<Express.Multer.File>,
    accessToken: string | undefined,
  ) {
    try {
      //트랜잭션이 롤백 됐을 때 실행되는 콜백 함수를 인자로 가지는 Hook. 메소드의 위치와 관계 없이 롤백이 일어나면 콜백 함수가 실행된다.
      runOnTransactionRollback((err) => {
        console.log('------Rollback------');
        console.log(err);
      });

      //문자열 JSON을 parse한 뒤, PatchPinDto타입의 객체를 생성한다.
      const pin = plainToClass(PatchPinDto, JSON.parse(pinStr));

      //새로 생성한 객체의 유효성 검증
      //유효하지 않은 키가 있으면 pinValError 배열에 추가된다.
      const pinValError = await validate(pin, {
        forbidUnknownValues: true,
      });
      if (pinValError.length > 0) {
        const fstVal =
          pinValError[0].constraints[
            Object.keys(pinValError[0].constraints)[0]
          ];
        throw new BadRequestException(null, fstVal);
      }

      //토큰의 유효성 검사
      const decode = jwt.verify(
        accessToken,
        this.configService.get<string>('ACCESS_SECRET'),
      );

      //키워드를 업데이트 한다.(없는 경우 새로 생성한다.)
      const keywords = [];
      //구의 정보를 기본 키워드로 넣는다
      keywords.push({ keyword: pin.ward });
      for (let i = 0; i < pin.keywords.length; i++) {
        keywords.push({ keyword: pin.keywords[i] });
      }
      //키워드 업데이트의 결과
      const newKeywords = await this.placeKeywordsRepository.save(keywords);
      //pin객체 안에 관계명인 PlaceKeywords를 key로 넣는다.
      delete pin.keywords;
      // pin['PlaceKeywords'] = newKeywords;

      //update시 leftjoin이 불가하기 때문에(https://github.com/typeorm/typeorm/issues/564) select문으로 업데이트가 가능한 레코드가 있는지 조회한다.
      //조건(유저, 루트 id, 핀 id)에 맞는 핀이 있는지 조회한다.
      const isExist = await this.pinsRepository
        .createQueryBuilder('Pins')
        .leftJoin('Pins.Routes', 'Routes')
        .where(
          'Pins.routesId = :routesId AND Pins.id = :id AND Routes.userId = :userId',
          { routesId: routeId, id: pinId, userId: decode['id'] },
        )
        .getOne();
      //레코드가 없는 경우(다른 유저, 또는 존재하지 않는 루트나 핀을 업데이트 하려는 경우)
      if (!isExist) {
        throw new UnauthorizedException();
      }

      //핀 업데이트
      await this.pinsRepository
        .createQueryBuilder()
        .update('Pins')
        .set(pin)
        .where('Pins.routesId = :routesId AND Pins.id = :id', {
          routesId: routeId,
          id: pinId,
        })
        .execute();

      //jointable을 갱신하기 위해 기존 레코드를 삭제한다.
      await this.pinsPlaceKeywordsRepository
        .createQueryBuilder()
        .delete()
        .where('pinId = :pinId', { pinId: pinId })
        .execute();

      //jointable을 갱신한다.
      newKeywords.forEach((obj) => {
        obj['pinId'] = pinId;
      });
      await this.pinsPlaceKeywordsRepository.save(newKeywords);

      const newPictures = [];
      files.forEach((file) => {
        newPictures.push({
          pinId: pinId,
          fileName: file.path,
        });
      });
      //DB에 사진 정보 저장
      await this.picturesRepository.save(newPictures);

      //tooClose 갱신을 위해 모든 핀들과의 관계를 재정의 한다.
      //효율적으로 하기 위해 join table을 만들거나 자기참조 관계를 만드는 방법, 지도를 100m*100m 단위로 범주화하는 방법을 생각해 봄
      //전자는 join table을 갱신하기 위해 모든 핀들 간의 관계를 확인해야 되서 의미가 없다.
      //후자는 서울을 100m^2단위로 쪼개야 되서 구현이 힘들다고 판단했다.
      const dbPins = await this.pinsRepository
        .createQueryBuilder('Pins')
        .select(['Pins.id', 'Pins.latitude', 'Pins.longitude', 'Pins.tooClose'])
        .getMany();

      //인접한 점이 생긴 경우 DB에도 업데이트 해줘야 한다
      //추가하려는 점과 인점한 DB의 핀들. 이 핀들의 tooClose를 true로 업데이트 한다.
      const updatePinInfoId = redefineTooClose(dbPins);

      //작동방식
      //1. select문으로 updatePinInfoId의 핀들을 조회한다
      //2. 변경 사항이 있는 레코드에만 update쿼리가 실행된다.(변경 사항이 없으면 update쿼리는 실행되지 않는다.)
      await this.pinsRepository.save(updatePinInfoId);
    } catch (err) {
      if (err.status === 401) {
        throw err;
      } else if (err.status === 400 || err instanceof SyntaxError) {
        //잘못된 JSON 형식을 받을 경우
        throw new BadRequestException(null, err.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Transactional() //open a transaction
  async deletePin(
    routeId: number,
    pinId: number,
    accessToken: string | undefined,
  ) {
    try {
      //트랜잭션이 롤백 됐을 때 실행되는 콜백 함수를 인자로 가지는 Hook. 메소드의 위치와 관계 없이 롤백이 일어나면 콜백 함수가 실행된다.
      runOnTransactionRollback((err) => {
        console.log('------Rollback------');
        console.log(err);
      });

      const decode = jwt.verify(
        accessToken,
        this.configService.get<string>('ACCESS_SECRET'),
      );

      //핀을 지우기 전, 핀에 속한 사진들의 정보를 가져온다.
      const picturesInfo = await this.picturesRepository
        .createQueryBuilder('Pictures')
        .select(['Pictures.fileName'])
        .where('pinId = :pinId', { pinId: pinId })
        .getMany();

      //삭제된 핀의 정보
      const result = await this.pinsRepository
        .createQueryBuilder('Pins')
        .innerJoin('Pins.Routes', 'Routes')
        .where(
          'Pins.routesId = :routesId AND Pins.id = :id AND Routes.userId = :userId',
          {
            routesId: routeId,
            id: pinId,
            userId: decode['id'],
          },
        )
        .getMany()
        .then((Pins) => {
          return this.pinsRepository.remove(Pins);
        });

      //없는 핀, 또는 다른 유저가 작성한 핀을 삭제 하려는 경우
      if (!result.length) {
        throw new UnauthorizedException();
      }

      //사진 파일 삭제
      for (let i = 0; i < picturesInfo.length; i++) {
        //동기적으로 파일 삭제
        fs.unlinkSync(
          `${join(__dirname, '..', '..', '..')}/${picturesInfo[i].fileName}`,
        );
      }

      //tooClose 칼럼 갱신. updatePin메소드와 동일하다
      const dbPins = await this.pinsRepository
        .createQueryBuilder('Pins')
        .select(['Pins.id', 'Pins.latitude', 'Pins.longitude', 'Pins.tooClose'])
        .getMany();
      const updatePinInfoId = redefineTooClose(dbPins);
      await this.pinsRepository.save(updatePinInfoId);
    } catch (err) {
      if (err.status === 401) {
        throw err;
      } else if (err instanceof JsonWebTokenError) {
        throw err;
      } else {
        //테이블의 정보는 삭제 되더라도 실제 파일이 없는 경우 이 에러가 발생한다. (테이블에서는 삭제 처리된다.)
        throw new InternalServerErrorException();
      }
    }
  }

  @Transactional() //open a transaction
  async createPin(
    routeId: number,
    pinStr: string,
    files: Array<Express.Multer.File>,
    accessToken: string | undefined,
  ) {
    try {
      //트랜잭션이 성공적으로 커밋 됐을 때 실행되는 콜백 함수를 인자로 가지는 Hook
      // runOnTransactionCommit(() => console.log('-------success-------'));

      //트랜잭션이 롤백 됐을 때 실행되는 콜백 함수를 인자로 가지는 Hook. 메소드의 위치와 관계 없이 롤백이 일어나면 콜백 함수가 실행된다.
      runOnTransactionRollback((err) => {
        console.log('------Rollback------');
        console.log(err);
      });

      //문자열 JSON을 parse한 뒤, PatchPinDto타입의 객체를 생성한다.
      const pin = plainToClass(PatchPinDto, JSON.parse(pinStr));
      //새로 생성한 객체의 유효성 검증
      //유효하지 않은 키가 있으면 pinValError 배열에 추가된다.
      const pinValError = await validate(pin, {
        forbidUnknownValues: true,
      });
      if (pinValError.length > 0) {
        const fstVal =
          pinValError[0].constraints[
            Object.keys(pinValError[0].constraints)[0]
          ];
        throw new BadRequestException(null, fstVal);
      }

      const decode = jwt.verify(
        accessToken,
        this.configService.get<string>('ACCESS_SECRET'),
      );

      //핀을 추가하려는 루트가 해당 사용자 소유인지 확인한다.
      const selectRouteResult = await this.routesRepository.findOne({
        userId: decode['id'],
        id: routeId,
      });
      if (!selectRouteResult) {
        throw new UnauthorizedException();
      }

      //핀을 생성한다.
      const newPin = { ...pin, routesId: routeId };
      //생성된 핀에 대한 정보
      const createPinResult = await this.pinsRepository.save(newPin);

      //키워드를 업데이트 한다.(없는 경우 새로 생성한다.)
      const keywords = [];
      //구의 정보를 기본 키워드로 넣는다
      keywords.push({ keyword: pin.ward });
      for (let i = 0; i < pin.keywords.length; i++) {
        keywords.push({ keyword: pin.keywords[i] });
      }
      //placeKeyword 테이블에 키워드들 추가
      //키워드 업데이트의 결과
      const newKeywords = await this.placeKeywordsRepository.save(keywords);

      //jointable을 갱신한다.
      newKeywords.forEach((obj) => {
        obj['pinId'] = createPinResult.id;
      });
      await this.pinsPlaceKeywordsRepository.save(newKeywords);

      const dbPins = await this.pinsRepository
        .createQueryBuilder('Pins')
        .select(['Pins.id', 'Pins.latitude', 'Pins.longitude', 'Pins.tooClose'])
        .getMany();

      //추가하려는 점과 인점한 DB의 핀들. 이 핀들의 tooClose를 true로 업데이트 한다.
      let dbPinId: { id: number; tooClose: boolean }[] = [];
      //isClosewithDB 함수는 newPin의 속성을 변경할 수 있다.(순수함수가 아니다.)
      dbPinId = Object.assign(dbPinId, isClosewithDB(dbPins, newPin));
      //DB핀들 업데이트 dbPinId가 빈 배열일 경우 실행되지 않는다.
      await this.pinsRepository.save(dbPinId);

      //생성한 핀을 이용해 사진의 정보를 저장한다.
      const newPictures = [];
      files.forEach((file) => {
        newPictures.push({
          pinId: createPinResult.id,
          fileName: file.path,
        });
      });

      //DB에 사진 정보 저장
      await this.picturesRepository.save(newPictures);
    } catch (err) {
      //잘못된 칼럼 정보를 추가하려는 경우
      if (err instanceof QueryFailedError) {
        throw new BadRequestException();
      } else if (err.status === 400 || err instanceof SyntaxError) {
        //잘못된 JSON 형식을 받을 경우
        throw new BadRequestException(null, err.message);
      } else if (err.status === 401) {
        throw err;
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @Transactional() //open a transaction
  async deletePicture(
    routeId: number,
    pinId: number,
    pictureId: number,
    accessToken: string | undefined,
  ) {
    try {
      //트랜잭션이 롤백 됐을 때 실행되는 콜백 함수를 인자로 가지는 Hook. 메소드의 위치와 관계 없이 롤백이 일어나면 콜백 함수가 실행된다.
      runOnTransactionRollback((err) => {
        console.log('------Rollback------');
        console.log(err);
      });

      const decode = jwt.verify(
        accessToken,
        this.configService.get<string>('ACCESS_SECRET'),
      );

      //사진을 지우기 전, 핀에 속한 사진의 정보를 가져온다.
      //유저id, 루트id등으로 조회한 사진이 없으면 예외를 던진다.
      const deleteResult = await this.picturesRepository
        .createQueryBuilder('Pictures')
        .leftJoin('Pictures.Pins', 'Pins')
        .leftJoin('Pins.Routes', 'Routes')
        .where(
          'Pictures.pinId = :pinId AND Pins.routesId = :routesId AND Routes.userId = :userId AND Pictures.id = :pictureId',
          {
            pinId: pinId,
            routesId: routeId,
            userId: decode['id'],
            pictureId: pictureId,
          },
        )
        .getOne();

      //없는 사진, 또는 다른 유저의 사진을 삭제하려는 경우
      if (!deleteResult) {
        throw new UnauthorizedException();
      }
      await this.picturesRepository.remove(deleteResult);

      //사진 파일 삭제
      //동기적으로 파일 삭제
      fs.unlinkSync(
        `${join(__dirname, '..', '..', '..')}/${deleteResult.fileName}`,
      );
    } catch (err) {
      if (err.status === 401) {
      } else if (err instanceof JsonWebTokenError) {
        throw err;
      } else {
        //테이블의 정보는 삭제 되더라도 실제 파일이 없는 경우 이 에러가 발생한다. (테이블에서는 삭제 처리된다.)
        throw new InternalServerErrorException();
      }
    }
  }
}
