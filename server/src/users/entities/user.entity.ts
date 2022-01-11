import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('Users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 45 })
  nickName: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 10, nullable: true })
  oauthLogin: string | null;

  @Column({ length: 100, nullable: true })
  saltedPassword: string | null;

  @Column({ length: 255, nullable: true })
  oauthCI: string | null;

  @Column({ length: 255, nullable: true })
  profileImage: string | null;
}
