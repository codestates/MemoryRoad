import { Injectable } from '@nestjs/common';
import { WardEntity } from './entities/ward.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WardsService {
  constructor(
    @InjectRepository(WardEntity)
    private wardsRepository: Repository<WardEntity>,
  ) {}

  async getRouteCount() {
    // 각 구별 객체를 받아올 배열.
    // const data = geojson.features;
    const wardInfo = await this.wardsRepository.find();
    return wardInfo;
  }
}
