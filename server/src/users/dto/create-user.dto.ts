import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nickName: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  salt?: string;
  saltedPassword?: string;
}
