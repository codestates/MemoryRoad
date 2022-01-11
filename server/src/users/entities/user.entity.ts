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

  @Column({ length: 100 })
  oauthLogin: string;

  @Column({ length: 100 })
  saltedPassword: string;

  @Column({ length: 255 })
  oauthCI: string;

<<<<<<< HEAD
  @Column({ length: 255 })
  profileImage: string;
=======
  @Column()
  profileImage: string;

  @OneToMany(() => RouteEntity, (Routes) => Routes.userId)
  Routes: RouteEntity[];
>>>>>>> dc8e800e607ed89297a09f97d5cf91a205bca1e5
}
