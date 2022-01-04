import {
  IsArray,
  IsBoolean,
  IsBooleanString,
  IsNumber,
  IsString,
} from 'class-validator';
import { Pin } from './../interface/pin.interface';

//DTO: 데이터가 네트워크를 통해 전송되는 방식을 정의하는 객체
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
