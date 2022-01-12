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
import { LoginUserDto } from './dto/login-userDto';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //회원가입
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const createUser = await this.usersService.create(createUserDto);
    return res.status(201).send({ createUser, message: '회원 가입 성공' });
  }

  //oauth 카카오
  @Post('/auth/oauth/kakao')
  async kakaoLogin(@Req() req: Request, @Res() res: Response) {
    const userInfo = await this.usersService.kakao(req.body);
    const accessToken: string = await this.usersService.getAccessToken(
      userInfo,
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).json({
      userName: userInfo.nickName,
      profile: userInfo.profileImage,
      email: userInfo.email,
      oauthLogin: userInfo.oauthLogin,
    });
  }

  //oauth 네이버
  @Post('/auth/oauth/naver')
  async naverLogin(@Req() req: Request, @Res() res: Response) {
    const userInfo = await this.usersService.naver(req.body);
    const accessToken: string = await this.usersService.getAccessToken(
      userInfo,
    );
    console.log(accessToken);
    console.log(userInfo);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).json({
      userName: userInfo.nickName,
      profile: userInfo.profileImage,
      email: userInfo.email,
      oauthLogin: userInfo.oauthLogin,
    });
  }

  //oauth 구글
  @Post('/auth/oauth/google')
  async googleLogin(@Req() req: Request, @Res() res: Response) {
    const userInfo = await this.usersService.google(req.body);
    const accessToken: string = await this.usersService.getAccessToken(
      userInfo,
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).json({
      userName: userInfo.nickName,
      profile: userInfo.profileImage,
      email: userInfo.email,
      oauthLogin: userInfo.oauthLogin,
    });
  }

  //로컬 로그인
  @Post('/auth/local')
  async localLogin(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const userInfo = await this.usersService.local(loginUserDto);
    const accessToken: string = await this.usersService.getAccessToken(
      userInfo,
    );
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      maxAge: 5 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });
    return res.status(200).json({
      userName: userInfo.nickName,
      profile: userInfo.profileImage,
      email: userInfo.email,
      oauthLogin: userInfo.oauthLogin,
    });
  }

  //중복된 이메일 여부 확인
  @Post('/auth/local/email')
  async checkEmail(@Body('email') email: string, @Res() res: Response) {
    const check = await this.usersService.checkEmail(email);
    return res.status(200).send({ check, message: '사용 가능한 이메일입니다' });
  }

  //일치하는 비밀번호 확인
  @Post('/auth/local/password')
  async checkPassword(
    @Body('password') password: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJwcm9maWxlSW1hZ2UiOm51bGwsImlhdCI6MTY0MTkxNDg3MCwiZXhwIjoxNjQxOTM2NDcwfQ.ObjUOjSAVvUNIB6obez7iL6_1Vd6rle01UgDakTRK6Y';
      await this.usersService.checkPassword(accessToken, password);
      return res.status(200).json({ message: '비밀번호가 일치합니다' });
    } catch (err) {
      return err;
    }
  }

  // 프로필 회원 정보 수정
  @Patch('profile')
  async updateProfile(
    @Body() profile: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      console.log(req.cookies);
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJwcm9maWxlSW1hZ2UiOm51bGwsImlhdCI6MTY0MTkxNDg3MCwiZXhwIjoxNjQxOTM2NDcwfQ.ObjUOjSAVvUNIB6obez7iL6_1Vd6rle01UgDakTRK6Y';
      await this.usersService.updateProfile(accessToken, profile);
      return res
        .status(200)
        .json({ message: '프로필 이미지가 변경되었습니다' });
    } catch (err) {
      return err;
    }
  }

  // 유저네임 회원 정보 수정
  @Patch('/user-name')
  async updateUserName(
    @Body() userName: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      console.log(req.cookies);
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJwcm9maWxlSW1hZ2UiOm51bGwsImlhdCI6MTY0MTkxNDg3MCwiZXhwIjoxNjQxOTM2NDcwfQ.ObjUOjSAVvUNIB6obez7iL6_1Vd6rle01UgDakTRK6Y';
      await this.usersService.updateUserName(accessToken, userName);
      return res.status(200).json({ message: '닉네임이 변경되었습니다' });
    } catch (err) {
      return err;
    }
  }
  // 비밀번호 정보 수정
  @Patch('/password')
  async updatePassword(
    @Body() password: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      console.log(req.cookies);
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJwcm9maWxlSW1hZ2UiOm51bGwsImlhdCI6MTY0MTkxNDg3MCwiZXhwIjoxNjQxOTM2NDcwfQ.ObjUOjSAVvUNIB6obez7iL6_1Vd6rle01UgDakTRK6Y';
      await this.usersService.updatePassword(accessToken, password);
      return res.status(200).json({ message: '비밀번호가 변경되었습니다' });
    } catch (err) {
      return err;
    }
  }

  // 회원 탈퇴
  @Delete()
  async remove(@Res() res: Response, @Req() req: Request) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJwcm9maWxlSW1hZ2UiOm51bGwsImlhdCI6MTY0MTkxNDg3MCwiZXhwIjoxNjQxOTM2NDcwfQ.ObjUOjSAVvUNIB6obez7iL6_1Vd6rle01UgDakTRK6Y';
      await this.usersService.remove(accessToken);
      res.cookie('accessToken', 'success', {
        httpOnly: true,
        maxAge: 5 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
      });
      return res.status(200).send({ message: '회원에서 탈퇴하셨습니다' });
    } catch (err) {
      return err;
    }
  }

  // 로그 아웃
  @Get('/auth')
  async logOut(@Res() res: Response, @Req() req: Request) {
    if (!req.cookies || !req.cookies.accessToken) {
      return res.status(401).json({ error: '쿠키 재요청이 필요합니다' });
    }
    try {
      const accessToken = req.cookies.accessToken;
      // const accessToken =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjIsIm5pY2tOYW1lIjoieWF5d3dAbmF2ZXIuY29tIiwiZW1haWwiOiJ5YXl3d0BuYXZlci5jb20iLCJvYXV0aExvZ2luIjoibmF2ZXIiLCJzYWx0ZWRQYXNzd29yZCI6bnVsbCwib2F1dGhDSSI6ImtCYTNOekRnelhSbmlJbnRQOTVFemZMLUpPalRDdnMwMFVvcjZvbTBpV3MiLCJwcm9maWxlSW1hZ2UiOm51bGwsImlhdCI6MTY0MTkxNDg3MCwiZXhwIjoxNjQxOTM2NDcwfQ.ObjUOjSAVvUNIB6obez7iL6_1Vd6rle01UgDakTRK6Y';
      await this.usersService.logOut(accessToken);
      //아무것도 없는 쿠키 전달
      res.cookie('accessToken', 'success', {
        httpOnly: true,
        maxAge: 5 * 60 * 60 * 1000,
        sameSite: 'none',
        secure: true,
      });
      return res.status(200).send({ message: '로그아웃 하셨습니다' });
    } catch (err) {
      return err;
    }
  }
}
