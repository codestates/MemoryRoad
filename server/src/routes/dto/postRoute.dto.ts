import { plainToClass, Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

import { PatchPinDto } from './patchPin.dto';

//DTO: 데이터가 네트워크를 통해 전송되는 방식을 정의하는 객체
export class PostRouteDto {
  // DTO를 사용함으로써, NestJS가 들어오는 쿼리에 대해 유효성을 검사할 수 있게 된다.
  @IsString()
  readonly routeName: string;

  @IsString()
  readonly description: string;

  @IsBoolean()
  readonly public: boolean;

  @IsString()
  readonly color: string;

  @IsNumber()
  readonly time: number;

  @Transform(({ value }) => {
    return new Date(value);
  })
  @IsDate()
  readonly date: Date;

  //pins배열에는 일반 객체가 들어있는데, 이 객체를 'PatchRouteDto'클래스로 만든다. (타입 안정성을 보장하기 위해)
  @Transform(({ value }) => {
    const result = [];
    for (let i = 0; i < value.length; i++) {
      const newPatchPinDto = plainToClass(PatchPinDto, value[i]);

      result.push(newPatchPinDto);
    }

    return result;
  })
  @IsObject({ each: true })
  pins: PatchPinDto[];
}
