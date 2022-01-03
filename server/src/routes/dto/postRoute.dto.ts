import { IsBoolean, IsNumber, IsString } from 'class-validator';
type pin = {
  ranking: number;
  locationName: string;
  latitude: number;
  longitude: number;
  address: string;
  description: string;
  tooClose: boolean; //서버에서 직접 계산해야 한다.
  startTime: string;
  endTime: string;
};

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

  readonly pins: pin[];
}
