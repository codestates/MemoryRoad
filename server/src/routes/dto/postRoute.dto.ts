import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsNumber,
  IsString,
} from 'class-validator';
import { Pin } from './../interface/pin.interface';

export class PostRouteDto {
  // DTO를 사용함으로써, NestJS가 들어오는 쿼리에 대해 유효성을 검사할 수 있게 된다.
  @IsString()
  readonly routeName: string;

  @IsString()
  readonly description: string;

  @IsBooleanString()
  readonly public: boolean;

  @IsString()
  readonly color: string;

  @IsNumber()
  readonly time: number;

  @IsArray()
  readonly pins: Pin[];
}
