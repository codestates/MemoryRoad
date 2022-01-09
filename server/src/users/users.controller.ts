import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-userDto';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  /*
  //회원가입
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    const createUser = await this.usersService.create(createUserDto);
    res.status(201).send({ createUser, message: '회원 가입 성공' });
  }

  //oauth 카카오
  @Post('/auth/oauth/kakao')
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.usersService.kakao(req.body);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).send({ message: '카카오 로그인 했습니다.' });
  }

  //oauth 네이버
  @Post('/auth/oauth/naver')
  async naverLogin(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.usersService.naver(req.body);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).send({ message: '네이버 로그인 했습니다.' });
  }

  //oauth 구글
  @Post('/auth/oauth/google')
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    const accessToken = await this.usersService.google(req.body);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).send({ message: '구글 로그인 했습니다.' });
  }

  //로컬 로그인
  @Post('/auth/local')
  async localLogin(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const accessToken = await this.usersService.local(loginUserDto);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    res.status(200).send({ message: '로컬 로그인 했습니다.' });
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
    @Body('password') password: string,
    @Res() res,
    @Req() req,
  ) {
    try {
      if (!req.cookies || !req.cookies.accessToken) {
        return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
      }
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJpYXQiOjE2NDE0NDQ4MzUsImV4cCI6MTY0MTQ2NjQzNX0.OcMyOMOZiLO-0V0w_ClBkVHK9-AmmbAzbndqcIV1k8s';
      const check = await this.usersService.checkPassword(
        accessToken,
        password,
      );
      res.status(200).send({ check: check, message: '비밀번호가 일치합니다' });
    } catch (err) {
      return err;
    }
  }

  // 회원 정보 수정
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @Res() res, @Req() req) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      console.log(req.cookies);
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJpYXQiOjE2NDE0NDQ4MzUsImV4cCI6MTY0MTQ2NjQzNX0.OcMyOMOZiLO-0V0w_ClBkVHK9-AmmbAzbndqcIV1k8s';
      const decoded = await this.usersService.update(
        accessToken,
        updateUserDto,
      );
      res
        .status(200)
        .json({ decoded: decoded, message: '회원 정보가 수정되었습니다' });
    } catch (err) {
      return err;
    }
  }

  // 회원 탈퇴
  @Delete()
  async remove(@Res() res, @Req() req) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJpYXQiOjE2NDE0NDQ4MzUsImV4cCI6MTY0MTQ2NjQzNX0.OcMyOMOZiLO-0V0w_ClBkVHK9-AmmbAzbndqcIV1k8s';
      await this.usersService.remove(accessToken);
      res.status(200).send({ message: '회원에서 탈퇴하셨습니다' });
    } catch (err) {
      return err;
    }
  }

  // 로그 아웃
  @Get('/auth')
  async logOut(@Res() res, @Req() req) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTEsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJpYXQiOjE2NDE0NDQ4MzUsImV4cCI6MTY0MTQ2NjQzNX0.OcMyOMOZiLO-0V0w_ClBkVHK9-AmmbAzbndqcIV1k8s';
      await this.usersService.logOut(accessToken);
      //아무것도 없는 쿠키 전달
      res.cookie('accessToken', 'success', {
        httpOnly: true,
        maxAge: 5 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
      });
      res.status(200).send({ message: '로그아웃 하셨습니다' });
    } catch (err) {
      return err;
    }
  }
  */
}
