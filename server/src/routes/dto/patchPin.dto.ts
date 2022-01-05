import { IsNumber, IsString } from 'class-validator';
import { Pin } from './../interface/pin.interface';

export class PatchPinDto implements Pin {
  @IsNumber()
  readonly ranking: number;

  @IsString()
  readonly locationName: string;

  @IsString()
  readonly address: string;

  @IsNumber()
  readonly latitude: number;

  @IsNumber()
  readonly longitude: number;

  @IsString()
  readonly startTime: string;

  @IsString()
  readonly endTime: string;

  //TODO 사진의 정보들
}
