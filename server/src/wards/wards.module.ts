import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WardEntity } from './entities/ward.entity';
import { WardsService } from './wards.service';
import { WardsController } from './wards.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([WardEntity]), HttpModule],
  controllers: [WardsController],
  providers: [WardsService],
  exports: [TypeOrmModule],
})
export class WardsModule {}
