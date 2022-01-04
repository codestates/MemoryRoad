import { IsBooleanString, IsNumber, IsString } from 'class-validator';

export class PatchRouteDto {
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
}
