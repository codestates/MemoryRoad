import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Pin } from './../interface/pin.interface';

//핀의 추가 업데이트 시 이용되는 DTO
export class PatchPinDto implements Pin {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  readonly ranking: number;

  @IsString()
  readonly locationName: string;

  @IsString()
  readonly lotAddress: string;

  @IsString()
  readonly roadAddress: string;

  @IsString()
  readonly ward: string;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  readonly latitude: number;

  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  readonly longitude: number;

  // @Transform(({ value }) => {
  //   return Number(value);
  // })
  @IsString()
  readonly startTime: string;

  // @Transform(({ value }) => {
  //   return Number(value);
  // })
  @IsString()
  readonly endTime: string;
}
