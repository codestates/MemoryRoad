import { RouteEntity } from 'src/routes/entities/route.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
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
  oauthLogin?: string | null;

  @Column({ length: 100, nullable: true })
  saltedPassword?: string | null;

  @Column({ length: 255, nullable: true })
  oauthCI?: string | null;

  @OneToMany(() => RouteEntity, (Routes) => Routes.userId, {
    cascade: true,
  })
  @JoinColumn()
  Routes?: RouteEntity[];

  @Column({ length: 255, nullable: true })
<<<<<<< HEAD
  profileImage?: string | null;
=======
  profileImage: string | null;
>>>>>>> 733dab8 (feat : delete picture)
}
