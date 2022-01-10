import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, UpdateResult } from 'typeorm';
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
  ) {}

  async getUserRoutes(page: number): Promise<object> {
    //TODO where문으로 해당 유저의 루트만 가져오기
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
        'Pictures.fileName',
      ])
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

  // 핀을 추가하기 위해서는 새로 생성된 루트의 아이디가 필요하므로, 루트를 생성하고, 루트 아이디를 이용해 핀들을 생성한다.
  async createRoute(routeStr: string, files: Array<Express.Multer.File>) {
    try {
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

      //TODO 유저 아이디 바꾸기
      //public은 예약어이다
      const { routeName, description, color, time } = routePins;
      const { pins } = routePins;
      const newRoute = await this.routesRepository.save({
        userId: 1,
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

      //pin각각에 routeId를 추가해 준다.
      pins.forEach((pin) => {
        pin['routesId'] = newRoute.id;
      });
      // console.log(pins);

      //새 핀들 생성
      //bulk insert
      const insertPinsResult = await this.pinsRepository.save(pins);

      //핀을 생성한 뒤, 핀의 아이디와 핀의 랭킹을 매칭하기 위한 객체
      const mapPinIdRanking = {};
      insertPinsResult.forEach((pin) => {
        mapPinIdRanking[pin.ranking] = pin.id;
      });

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
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  //TODO: 해당 사용자가 작성한 루트만 수정할 수 있어야 한다.
  async updateRoute(routeId: number, route: PatchRouteDto) {
    try {
      //루트 아이디와 일치하는 요소 업데이트
      const result = await this.routesRepository
        .createQueryBuilder()
        .update('Routes')
        .set(route)
        .where('id = :id', { id: routeId })
        .execute();

      if (!result.affected) {
        //없는 루트, 또는 다른 유저가 작성한 루트를 업데이트 하려는 경우
        throw new NotFoundException();
      }
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteRoute(routeId: number) {
    try {
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
        .where('id = :id', { id: routeId })
        .execute();

      if (!result.affected) {
        //없는 루트, 또는 다른 유저가 작성한 루트를 삭제 하려는 경우
        throw new NotFoundException();
      }

      //사진 파일 삭제
      for (let i = 0; i < picturesInfo.length; i++) {
        //동기적으로 파일 삭제
        fs.unlinkSync(
          `${join(__dirname, '..', '..')}/${picturesInfo[i].fileName}`,
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
      if (err.status === 404) {
        throw new NotFoundException();
      } else {
        //테이블의 정보는 삭제 되더라도 실제 파일이 없는 경우 이 에러가 발생한다. (테이블에서는 삭제 처리된다.)
        throw new InternalServerErrorException();
      }
    }
  }

  async getPins(routeId: number): Promise<PinEntity[]> {
    //TODO루트가 해당 사용자 소유인지 확인하기

    const pins = await this.pinsRepository
      .createQueryBuilder('Pins') //alias -> SELECT Pins as Pins
      .leftJoinAndSelect('Pins.Pictures', 'Pictures')
      .where('Pins.routesId = :id', { id: routeId })
      .orderBy('Pins.ranking')
      .addOrderBy('Pictures.id')
      .getMany(); //여러 개의 결과를 가져온다. entity를 반환한다. getRawMany등으로 raw data를 가져올 수 있다.

    return pins;
  }

  async updatePin(
    routeId: number,
    pinId: number,
    pin: PatchPinDto,
    files: Array<Express.Multer.File>,
  ): Promise<UpdateResult> {
    try {
      const result = await this.pinsRepository
        .createQueryBuilder()
        .update('Pins')
        .set(pin)
        .where('routesId = :routesId AND id = :id', {
          routesId: routeId,
          id: pinId,
        })
        .execute();

      if (!result.affected) {
        throw new NotFoundException();
      }

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
      return result;
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deletePin(routeId: number, pinId: number) {
    try {
      //핀을 지우기 전, 핀에 속한 사진들의 정보를 가져온다.
      const picturesInfo = await this.picturesRepository
        .createQueryBuilder('Pictures')
        .select(['Pictures.fileName'])
        .where('pinId = :pinId', { pinId: pinId })
        .getMany();

      const result = await this.pinsRepository
        .createQueryBuilder()
        .delete()
        .from('Pins')
        .where('routesId = :routesId AND id = :id', {
          routesId: routeId,
          id: pinId,
        })
        .execute();
      //없는 핀, 또는 다른 유저가 작성한 핀을 삭제 하려는 경우
      if (!result.affected) {
        throw new NotFoundException();
      }

      //사진 파일 삭제
      for (let i = 0; i < picturesInfo.length; i++) {
        //동기적으로 파일 삭제
        fs.unlinkSync(
          `${join(__dirname, '..', '..')}/${picturesInfo[i].fileName}`,
        );
      }

      //tooClose 칼럼 갱신. updatePin메소드와 동일하다
      const dbPins = await this.pinsRepository
        .createQueryBuilder('Pins')
        .select(['Pins.id', 'Pins.latitude', 'Pins.longitude', 'Pins.tooClose'])
        .getMany();
      const updatePinInfoId = redefineTooClose(dbPins);
      await this.pinsRepository.save(updatePinInfoId);

      return result;
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException();
      } else {
        //테이블의 정보는 삭제 되더라도 실제 파일이 없는 경우 이 에러가 발생한다. (테이블에서는 삭제 처리된다.)
        throw new InternalServerErrorException();
      }
    }
  }

  async createPin(
    routeId: number,
    pin: PatchPinDto,
    files: Array<Express.Multer.File>,
  ) {
    try {
      const newPin = { ...pin, routesId: routeId };
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
      const createPinResult = await this.pinsRepository.save(newPin);
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
      }
      throw new InternalServerErrorException();
    }
  }
}
