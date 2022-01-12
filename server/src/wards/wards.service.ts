import { Injectable } from '@nestjs/common';
import { WardEntity } from './entities/ward.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import geojson from '../memoryRoad.json';

@Injectable()
export class WardsService {
  constructor(
    @InjectRepository(WardEntity)
    private wardsRepository: Repository<WardEntity>,
  ) {}

  async getRouteCount() {
    // 각 구별 객체를 받아올 배열.
    const data = geojson.features;
    // console.log(data);

    //구역 이름들을 전부 다 업데이트
    // for (let i = 0; i < data.length; i++) {
    //   await this.wardsRepository.save({
    //     id: data[i].properties.SIG_KOR_NM,
    //     routesNumber: 0,
    //   });
    // }

    const wardInfo = await this.wardsRepository.find();
    console.log(wardInfo);

    return wardInfo;
    // const wardCount = await this.wardsRepository.find()
    //각 구별 루트 개수를 구하여 보내줘야 한다.

    // const newWard = this.wardsRepository.save({
    //   id,
    // });

    // await getConnection()
    //   .createQueryBuilder()
    //   .relation(WardEntity, 'Routes')
    //   .of()
    //   .add();

    return;
  }
}
