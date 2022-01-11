import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RouteEntity } from './route.entity';
import { PictureEntity } from './picture.entity';
import { PlaceKeywordEntity } from './placeKeyword.entity';

@Entity('Pins')
export class PinEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //참조하는 루트가 삭제되면 같이 삭제된다.
  @ManyToOne(() => RouteEntity, (Routes) => Routes.id, { onDelete: 'CASCADE' })
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
  startTime: number;

  @Column()
  endTime: number;

  @OneToMany(() => PictureEntity, (Pictures) => Pictures.pinId, {
    cascade: true,
  })
  Pictures: PictureEntity[];

  //M:N 조인테이블 설정.
  @ManyToMany(
    () => PlaceKeywordEntity,
    (PlaceKeywords) => PlaceKeywords.keyword,
    { cascade: true },
  )
  @JoinTable({
    name: 'PinsPlaceKeywords',
    joinColumn: {
      name: 'pinId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'keyword',
      referencedColumnName: 'keyword',
    },
  })
  PlaceKeywords: PlaceKeywordEntity[];
}
