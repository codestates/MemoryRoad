import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-userDto';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
// import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as jwt from 'jsonwebtoken';
import requestPromise from 'request-promise';
import fs from 'fs';
import { join } from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    // private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    // 이메일과 닉네임을 확인해서 있는지 없는지 확인
    const isExistemail: UserEntity = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    const isExistNick: UserEntity = await this.usersRepository.findOne({
      nickName: createUserDto.nickName,
    });
    console.log('이게 콘솔임', isExistemail);
    if (isExistemail) {
      throw new BadRequestException(`사용중인 이메일입니다.`);
    }
    if (isExistNick) {
      throw new BadRequestException(`사용중인 닉네임입니다.`);
    }

    //bcrypt를 통한 단방향 암호화
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    const salt = await bcrypt.genSalt();
    createUserDto.saltedPassword = await bcrypt.hash(
      createUserDto.password,
      salt,
    );
    console.log(createUserDto.saltedPassword);
    try {
      const user: UserEntity = await this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException(`회원가입에 실패하였습니다.\n ${error}`);
    }
  }
  async kakao(body: any): Promise<UserEntity> {
    const options = {
      uri: 'https://kauth.kakao.com/oauth/token',
      method: 'POST',
      form: {
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('KAKAO_CLIENT_ID'),
        client_secret: this.configService.get<string>('KAKAO_CLIENT_SECRET'),
        redirect_uri: 'https://memory-road.net',
        code: body.authorizationCode,
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      json: true,
    };
    const token = await requestPromise(options, function (error, res, body) {
      return res;
    });

    const kakaoAccessToken = token.access_token;
    const kakaoInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${kakaoAccessToken}`,
      },
    });
    const result = kakaoInfo.data;
    const profile = result.properties.profile_image;
    let userInfo: UserEntity = await this.usersRepository.findOne({
      email: result.kakao_account.email,
      oauthLogin: 'kakao',
    });
    if (!userInfo) {
      const sameEmail: UserEntity = await this.usersRepository.findOne({
        email: result.kakao_account.email,
      });
      if (sameEmail) {
        throw new BadRequestException('이미 사용중인 이메일입니다');
      }
      userInfo = await this.usersRepository.save({
        nickName: result.properties.nickname,
        email: result.kakao_account.email,
        oauthLogin: 'kakao',
        saltedPassword: null,
        oauthCI: result.id,
        profileImage: profile,
      });
    }
    console.log(userInfo);
    return userInfo;
  }
  async naver(body: any): Promise<UserEntity> {
    const redirectURI = encodeURI('https://memory-road.net');
    const code = body.authorizationCode;
    const state = body.state;

    const apiUrl =
      'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=' +
      this.configService.get<string>('NAVER_CLIENT_ID') +
      '&client_secret=' +
      this.configService.get<string>('NAVER_CLIENT_SECRET') +
      '&redirect_uri=' +
      redirectURI +
      '&code=' +
      code +
      '&state=' +
      state;

    const acceptToken = await axios.post(apiUrl);
    const naverAccessToken = acceptToken.data.access_token;
    const token = 'Bearer ' + naverAccessToken;

    const naverInfo = await axios
      .get('https://openapi.naver.com/v1/nid/me', {
        headers: { Authorization: token },
      })
      .catch((err) => {
        throw new InternalServerErrorException('잘못된 접근입니다');
      });

    const result = naverInfo.data.response;
    const profile = result.profile_image; //프로필 사진은 전달 안 해주고 있음
    console.log(result);
    // 여기까지가 데이터 가져오는 코드
    let userInfo: UserEntity = await this.usersRepository.findOne({
      email: result.email,
      oauthLogin: 'naver',
    });
    if (!userInfo) {
      const sameEmail: UserEntity = await this.usersRepository.findOne({
        email: result.email,
      });
      if (sameEmail) {
        throw new BadRequestException('이미 사용중인 이메일입니다');
      }
      userInfo = await this.usersRepository.save({
        nickName: result.email,
        email: result.email,
        oauthLogin: 'naver',
        saltedPassword: null,
        oauthCI: result.id,
        profileImage: profile,
      });
    }
    console.log(userInfo);
    return userInfo;
  }
  async google(body: any): Promise<UserEntity> {
    const decode: any = await axios
      .post('https://oauth2.googleapis.com/token', {
        client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        code: body.authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: 'https://memory-road.net',
      })
      .then((resp) => {
        const idToken = resp.data.id_token;
        const info = jwtDecode(idToken);
        console.log(idToken);
        console.log(info);
        return info;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    const { email, name, picture } = decode; // picture 아직 전달 안 해줬음.
    let userInfo: UserEntity = await this.usersRepository.findOne({
      email: email,
      oauthLogin: 'google',
    });
    console.log(userInfo);
    if (!userInfo) {
      const sameEmail: UserEntity = await this.usersRepository.findOne({
        email: email,
      });
      if (sameEmail) {
        throw new BadRequestException('이미 사용중인 이메일입니다');
      }
      console.log(name, email, picture);
      userInfo = await this.usersRepository.save({
        nickName: name,
        email: email,
        oauthLogin: 'google',
        saltedPassword: null,
        oauthCI: null,
        profileImage: picture,
      });
    }
    console.log(userInfo);
    return userInfo;
  }
  //로컬 로그인 이메일, 비밀번호
  async local(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const isExistUser: UserEntity = await this.usersRepository.findOne({
      email: loginUserDto.email,
      oauthLogin: null,
    });
    if (!isExistUser) {
      throw new UnauthorizedException(`유효하지 않은 이메일입니다`);
    }
    const isCorrectPassword = await bcrypt.compare(
      loginUserDto.password,
      isExistUser.saltedPassword,
    );
    console.log(isExistUser.saltedPassword);
    console.log(isCorrectPassword);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(`비밀번호가 일치하지 않습니다`);
    }
    console.log(isExistUser);
    return isExistUser;
  }

  //로그아웃, 하는 건 없는데, 로그아웃 이후의 이벤트등을 추가할 경우에 사용할 수 있을 것 같아 남겨둠
  async logOut(accessToken: string): Promise<string | jwt.JwtPayload> {
    const decoded = await this.verifyAccessToken(accessToken);
    return decoded;
  }

  //회원 정보 업데이트 프로필이미지
  async updateProfile(accessToken: string, file: Express.Multer.File) {
    const decoded = await this.verifyAccessToken(accessToken);
    const deleteFile: UserEntity = await this.usersRepository.findOne({
      id: decoded['id'],
    });
    fs.unlinkSync(
      `${join(__dirname, '..', '..', '..')}/${deleteFile['profileImage']}`,
    );

    decoded['profileImage'] = file.path;
    const user: UserEntity = {
      id: decoded['id'],
      email: decoded['email'],
      nickName: decoded['nickName'],
      profileImage: decoded['profileImage'],
    };
    await this.usersRepository.save(user);
    return file.path;
  }
  //회원 정보 업데이트 닉네임
  async updateUserName(accessToken: string, userName: string) {
    const decoded = await this.verifyAccessToken(accessToken);
    decoded['nickName'] = userName;
    console.log(decoded['nickName']);
    const user: UserEntity = {
      id: decoded['id'],
      email: decoded['email'],
      nickName: decoded['nickName'],
    };
    await this.usersRepository.save(user);
  }
  //회원 정보 업데이트 비밀번호
  async updatePassword(accessToken: string, password: string) {
    const decoded = await this.verifyAccessToken(accessToken);
    const salt = await bcrypt.genSalt();
    decoded['saltedPassword'] = await bcrypt.hash(password, salt);
    const user: UserEntity = {
      id: decoded['id'],
      email: decoded['email'],
      nickName: decoded['nickName'],
      saltedPassword: decoded['saltedPassword'],
    };
    await this.usersRepository.save(user);
  }

  //회원 탈퇴
  async remove(accessToken: string) {
    const decoded = await this.verifyAccessToken(accessToken);
    await this.usersRepository.delete({ id: decoded['id'] });
  }

  //비밀번호 검증 엔드포인트
  async checkPassword(accessToken: string, password: string) {
    const decoded = await this.verifyAccessToken(accessToken);
    const isExistPassword = await bcrypt.compare(
      password,
      decoded['saltedPassword'],
    );
    if (!isExistPassword) {
      throw new UnauthorizedException(`비밀번호가 일치하지 않습니다`);
    }
  }

  //이메일 검증 엔드포인트
  async checkEmail(email: string) {
    const isExistEmail: UserEntity = await this.usersRepository.findOne({
      email: email,
    });
    console.log(isExistEmail);
    if (isExistEmail) {
      throw new BadRequestException('사용중인 이메일입니다');
    }
  }
  // 쿠키 검증
  async verifyAccessToken(
    accessToken: string,
  ): Promise<string | jwt.JwtPayload> {
    const decoded = await jwt.verify(
      accessToken,
      this.configService.get<string>('ACCESS_SECRET'),
    );
    return decoded;
  }

  //액세스 토큰을 만들어줌
  async getAccessToken(userInfo: UserEntity): Promise<string> {
    const accessToken = await jwt.sign(
      { ...userInfo },
      this.configService.get<string>('ACCESS_SECRET'),
      { expiresIn: '6h' },
    );
    console.log(this.configService.get<string>('ACCESS_SECRET'));
    return accessToken;
  }
}
