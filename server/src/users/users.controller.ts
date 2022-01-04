import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //회원가입
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res): Promise<any> {
    const createUser = await this.usersService.create(createUserDto);
    res.status(200).send({ createUser, message: '회원 가입 성공' });
  }

  //oauth 카카오
  @Post('/auth/oauth/kakao')
  kakaoLogin() {
    return this.usersService.kakao();
  }

  //oauth 네이버
  @Post('/auth/oauth/naver')
  naverLogin() {
    return this.usersService.naver();
  }

  //oauth 구글
  @Post('/auth/oauth/google')
  googleLogin() {
    return this.usersService.google();
  }

  //로컬 로그인
  @Post('/auth/local')
  localLogin() {
    return this.usersService.local();
  }

  //중복된 이메일 여부 확인
  @Post('/auth/local/email')
  async checkEmail(@Body('email') email: string, @Res() res) {
    const check = await this.usersService.checkEmail(email);
    res.status(200).send({ check, message: '사용 가능한 이메일입니다' });
  }

  //일치하는 비밀번호 확인
  @Post('/auth/local/password')
  async checkPassword(
    @Body('salt') salt: string,
    @Body('password') password: string,
    @Res() res,
  ) {
    const check = await this.usersService.checkPassword(password, salt);
    res.status(200).send({ check, message: '비밀번호가 일치합니다' });
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    this.usersService.update(+id, updateUserDto);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('/auth')
  logOut() {
    return this.usersService.logOut();
  }
}
