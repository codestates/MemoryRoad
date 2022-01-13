import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { PinEntity } from './pin.entity';
import { WardEntity } from '../../wards/entities/ward.entity';

@Entity('Routes')
export class RouteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (Users) => Users.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  Users: UserEntity;

  @Column()
  userId: number;

  @Column({ length: 45 })
  routeName: string;

  @Column({ length: 45 })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  public: boolean;

  @Column({ length: 45 })
  color: string;

  @Column()
  time: number;

  @OneToMany(() => PinEntity, (Pins) => Pins.Routes, {
    cascade: true,
  })
  @JoinColumn()
  Pins: PinEntity[];

  //M:N 조인테이블 설정.
  @ManyToMany(() => WardEntity, (wards) => wards.id, { cascade: true })
  @JoinTable({
    name: 'RoutesWards',
    joinColumn: {
      name: 'routeId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'wardId',
      referencedColumnName: 'id',
    },
  })
  wards: WardEntity[];
}
