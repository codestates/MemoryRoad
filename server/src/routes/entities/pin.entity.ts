import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { RouteEntity } from './route.entity';
import { PictureEntity } from './picture.entity';

@Entity('Pins')
export class PinEntity {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => RouteEntity, (Routes) => Routes.id)
  Routes: RouteEntity;

  @Column()
  ranking: number;

  @Column({ length: 45 })
  locationName: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({ length: 45 })
  address: string;

  @Column({ length: 255 })
  description: string;

  @Column()
  tooClose: boolean;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @OneToMany(() => PictureEntity, (Pictures) => Pictures.Pins)
  Pictures: PictureEntity[];
}
