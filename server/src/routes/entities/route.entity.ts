import {
  Column,
  CreateDateColumn,
  Entity,
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

  @OneToMany(() => PinEntity, (Pins) => Pins.routesId, {
    cascade: true,
  })
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
