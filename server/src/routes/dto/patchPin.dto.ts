import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { Pin } from './../interface/pin.interface';

export class PatchPinDto implements Pin {
  @Transform(({ value }) => {
    return Number(value);
  })
  @IsNumber()
  readonly ranking: number;

  @IsString()
  readonly locationName: string;

  @IsString()
  readonly address: string;

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
