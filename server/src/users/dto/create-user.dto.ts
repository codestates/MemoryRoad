import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nickName: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
  @IsString()
  salt?: string;
  @IsString()
  saltedPassword?: string;
  @IsString()
  profileImage?: string;
}
