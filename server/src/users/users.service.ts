import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-userDto';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
// import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import * as jwt from 'jsonwebtoken';
import requestPromise from 'request-promise';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    // private httpService: HttpService,
    private configService: ConfigService,
  ) {}
/*
  async create(createUserDto: CreateUserDto) {
    // 이메일과 닉네임을 확인해서 있는지 없는지 확인
    const isExistemail: Users = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    const isExistNick: Users = await this.usersRepository.findOne({
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

    createUserDto.salt = await bcrypt.genSalt();
    createUserDto.saltedPassword = await bcrypt.hash(
      createUserDto.password,
      createUserDto.salt,
    );
    try {
      const user: Users = await this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException(`회원가입에 실패하였습니다.\n ${error}`);
    }
  }
  async kakao(body: any) {
    const options = {
      uri: 'https://kauth.kakao.com/oauth/token',
      method: 'POST',
      form: {
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('KAKAO_CLIENT_ID'),
        client_secret: this.configService.get<string>('KAKAO_CLIENT_SECRET'),
        redirect_uri: 'http://localhost:3000',
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
    // {
    //   id: 2066492386,
    //   connected_at: '2022-01-05T14:33:16Z',
    //   properties: {
    //     nickname: '양재영',
    //     profile_image: 'http://k.kakaocdn.net/dn/crXJwu/btqUsRhQUx0/cH6CxkKCcteXkkcuRUulx1/img_640x640.jpg',
    //     thumbnail_image: 'http://k.kakaocdn.net/dn/crXJwu/btqUsRhQUx0/cH6CxkKCcteXkkcuRUulx1/img_110x110.jpg'
    //   },
    //   kakao_account: {
    //     profile_nickname_needs_agreement: false,
    //     profile_image_needs_agreement: false,
    //     profile: {
    //       nickname: '양재영',
    //       thumbnail_image_url: 'http://k.kakaocdn.net/dn/crXJwu/btqUsRhQUx0/cH6CxkKCcteXkkcuRUulx1/img_110x110.jpg',
    //       profile_image_url: 'http://k.kakaocdn.net/dn/crXJwu/btqUsRhQUx0/cH6CxkKCcteXkkcuRUulx1/img_640x640.jpg',
    //       is_default_image: false
    //     },
    //     has_email: true,
    //     email_needs_agreement: false,
    //     is_email_valid: true,
    //     is_email_verified: true,
    //     email: 'terrabattle@naver.com'
    //   }
    // }
    let userInfo: Users = await this.usersRepository.findOne({
      email: result.kakao_account.email,
      oauthLogin: 'kakao',
    });
    if (!userInfo) {
      const sameEmail: Users = await this.usersRepository.findOne({
        email: result.kakao_account.email,
      });
      if (sameEmail) {
        throw new BadRequestException('이미 사용중인 이메일입니다');
      }
      await this.usersRepository.save({
        nickName: result.properties.nickname,
        email: result.kakao_account.email,
        oauthLogin: 'kakao',
        saltedPassword: null,
        oauthCI: result.id,
      });
      userInfo = await this.usersRepository.findOne({
        email: result.email,
      });
    }
    const accessToken = jwt.sign(
      { ...userInfo },
      this.configService.get<string>('ACCESS_SECRET'),
      { expiresIn: '6h' },
    );
    return accessToken;
  }
  async naver(body: any) {
    const redirectURI = encodeURI('https://localhost:3000');
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
    let userInfo: Users = await this.usersRepository.findOne({
      email: result.email,
      oauthLogin: 'naver',
    });
    if (!userInfo) {
      const sameEmail: Users = await this.usersRepository.findOne({
        email: result.email,
      });
      if (sameEmail) {
        throw new BadRequestException('이미 사용중인 이메일입니다');
      }
      await this.usersRepository.save({
        nickName: result.email,
        email: result.email,
        oauthLogin: 'naver',
        saltedPassword: null,
        oauthCI: result.id,
      });
      userInfo = await this.usersRepository.findOne({
        email: result.email,
      });
    }
    const accessToken = jwt.sign(
      { ...userInfo },
      this.configService.get<string>('ACCESS_SECRET'),
      { expiresIn: '6h' },
    );
    return accessToken;
  }
  async google(body: any) {
    const decode: any = await axios
      .post('https://oauth2.googleapis.com/token', {
        client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
        client_secret: this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
        code: body.authorizationCode,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000',
      })
      .then((resp) => {
        const idToken = resp.data.id_token;
        const info = jwtDecode(idToken);
        return info;
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
    const { email, name, picture } = decode; // picture 아직 전달 안 해줬음.
    let userInfo: Users = await this.usersRepository.findOne({
      email: email,
      oauthLogin: 'google',
    });
    if (!userInfo) {
      const sameEmail: Users = await this.usersRepository.findOne({
        email: email,
      });
      if (sameEmail) {
        throw new BadRequestException('이미 사용중인 이메일입니다');
      }
      await this.usersRepository.save({
        nickName: name,
        email: email,
        oauthLogin: 'google',
        saltedPassword: null,
        oauthCI: null,
      });
      userInfo = await this.usersRepository.findOne({
        email: email,
      });
    }
    const accessToken = jwt.sign(
      { ...userInfo },
      this.configService.get<string>('ACCESS_SECRET'),
      { expiresIn: '6h' },
    );
    return accessToken;
  }
  //로컬 로그인 이메일, 비밀번호
  async local(loginUserDto: LoginUserDto) {
    const isExistUser: Users = await this.usersRepository.findOne({
      email: loginUserDto.email,
    });
    if (!isExistUser) {
      throw new NotFoundException(`유효하지 않은 이메일입니다`);
    }
    if (!bcrypt.compare(loginUserDto.password, isExistUser.saltedPassword)) {
      throw new NotFoundException(`비밀번호가 일치하지 않습니다`);
    }
    const accessToken = jwt.sign(
      { ...isExistUser },
      this.configService.get<string>('ACCESS_SECRET'),
      { expiresIn: '6h' },
    );
    return accessToken;
  }
  //로그아웃
  async logOut(accessToken: string) {
    const decoded = this.verifyAccessToken(accessToken);
    return decoded;
  }

  //회원 정보 업데이트 닉네임. 비밀번호, 프로필이미지
  async update(accessToken: string, updateUserDto: UpdateUserDto) {
    const decoded = this.verifyAccessToken(accessToken);
    console.log(decoded);
    if (updateUserDto.nickName) {
      decoded.nickName = updateUserDto.nickName;
    }
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      decoded.saltedPassword = await bcrypt.hash(updateUserDto.password, salt);
    }
    if (updateUserDto.profileImage) {
      decoded.profileImage = updateUserDto.profileImage;
    }
    // 닉네임, 비번, 프로필 이미지 중에 하나만 와도 바꿔줘야 한다.
    await this.usersRepository.save(decoded);
    console.log(decoded);
    return decoded;
  }

  //회원 탈퇴
  async remove(accessToken: string) {
    const decoded = this.verifyAccessToken(accessToken);
    await this.usersRepository.delete({ id: decoded.id });
  }

  //이것도 쿠키받아서 쿠키로 처리해줘야 하네.
  async checkPassword(accessToken: string, password: string) {
    const decoded = this.verifyAccessToken(accessToken);
    const isExistPassword = await bcrypt.compare(
      password,
      decoded.saltedPassword,
    );
    if (!isExistPassword) {
      throw new BadRequestException(`비밀번호가 일치하지 않습니다`);
    }
  }

  async checkEmail(email: string) {
    const isExistEmail: Users = await this.usersRepository.findOne({
      email: email,
    });
    if (isExistEmail) {
      throw new BadRequestException('사용중인 이메일입니다');
    }
  }
  */
  // 쿠키 검증
  verifyAccessToken(accessToken: string) {
    const decoded = jwt.verify(
      accessToken,
      this.configService.get<string>('ACCESS_SECRET'),
      (err, decoded) => {
        if (err) throw new BadRequestException(`${err}`);
        return decoded;
      },
    );
    return decoded;
  }
  
}
