import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { PinEntity } from './pin.entity';

@Entity('Routes')
export class RouteEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ length: 45 })
  routeName: string;

  @Column({ length: 45 })
  description: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  @Column()
  public: boolean;

  @Column({ length: 45 })
  color: string;

  @Column()
  time: number;

  @OneToMany(() => PinEntity, (Pins) => Pins.Routes)
  Pins: PinEntity[];
}
