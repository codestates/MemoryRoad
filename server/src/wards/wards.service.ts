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
    console.log(data);
    console.log(data[0]);
    const Wardslist: object[] = [];

    //각 구별 루트 개수를 구하여 보내줘야 한다.

    // const newWard = this.wardsRepository.save({
    //   id,
    // });

    // await getConnection()
    //   .createQueryBuilder()
    //   .relation(WardEntity, 'Routes')
    //   .of()
    //   .add();
  }
}
