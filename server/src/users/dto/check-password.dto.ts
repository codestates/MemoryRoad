import { IsString } from 'class-validator';

export class CheckPasswordDto {
  @IsString()
  password: string;
  @IsString()
  salt: string;
}
