import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// 닉네임. 비밀번호, 프로필이미지
export class UpdateUserDto extends PartialType(CreateUserDto) {}
