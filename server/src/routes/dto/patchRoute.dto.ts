import { Transform } from 'class-transformer';
import { IsBoolean, IsDate, IsNumber, IsString } from 'class-validator';

export class PatchRouteDto {
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
}
