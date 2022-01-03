import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // 이메일과 닉네임을 확인해서 있는지 없는지 확인
    const isExistemail: Users = await this.usersRepository.findOne({
      email: createUserDto.email,
    });
    const isExistNick: Users = await this.usersRepository.findOne({
      nickName: createUserDto.nickName,
    });
    // console.log(isExistNick);
    // console.log(isExistemail);
    if (isExistemail) {
      throw new NotFoundException(`사용중인 이메일입니다.`);
    }
    if (isExistNick) {
      throw new NotFoundException(`사용중인 닉네임입니다.`);
    }

    //bcrypt를 통한 단방향 암호화
    const queryRunner = await getConnection().createQueryRunner();
    await queryRunner.startTransaction();

    createUserDto.salt = await bcrypt.genSalt();
    createUserDto.saltedPassword = await bcrypt.hash(
      createUserDto.password,
      createUserDto.salt,
    );
    // console.log(createUserDto.salt);
    // console.log(createUserDto.saltedPassword);
    try {
      const user: Users = await this.usersRepository.create(createUserDto);
      await this.usersRepository.save(user);
      // console.log(user);
      // console.log(result);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new NotFoundException(`Failed SignUp ${error}`);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  kakao() {
    return;
  }
  naver() {
    return;
  }
  google() {
    return;
  }
  local() {
    return;
  }
  logOut() {
    return;
  }
  async checkPassword() {
    return;
  }
  async checkEmail() {
    return;
  }
}
