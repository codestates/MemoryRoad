import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RouteEntity } from './route.entity';
import { PictureEntity } from './picture.entity';

@Entity('Pins')
export class PinEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //참조하는 루트가 삭제되면 같이 삭제된다.
  @ManyToOne(() => RouteEntity, (Routes) => Routes.id)
  @JoinColumn({ name: 'routesId' })
  Routes: RouteEntity;

  @Column()
  routesId: number;

  @Column()
  ranking: number;

  @Column({ length: 45 })
  locationName: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({ length: 100 })
  lotAddress: string;

  @Column({ length: 100 })
  roadAddress: string;

  @Column({ length: 10 })
  ward: string;

  @Column()
  tooClose: boolean;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @OneToMany(() => PictureEntity, (Pictures) => Pictures.Pins)
  Pictures: PictureEntity[];
}
