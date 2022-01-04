import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('Users')
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  nickName: string;

  @Column({ length: 45, unique: true })
  email: string;

  @Column({ length: 10 })
  oauthLogin: string;

  @Column({ length: 45 })
  saltedPassword: string;

  @Column({ length: 30 })
  salt: string;

  @Column()
  oauthCI: string;
}
