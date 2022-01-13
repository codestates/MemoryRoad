import {
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { PinsPlaceKeywordEntity } from './pinsPlaceKeyword.entity';

@Entity('PlaceKeywords')
export class PlaceKeywordEntity {
  @PrimaryColumn()
  keyword: string;

  //M:N 조인테이블 설정.
  // @ManyToMany(() => PinEntity, (Pins) => Pins.id, { cascade: true })
  // @JoinTable({
  //   name: 'PinsPlaceKeywords',
  //   joinColumn: {
  //     name: 'keyword',
  //     referencedColumnName: 'keyword',
  //   },
  //   inverseJoinColumn: {
  //     name: 'pinId',
  //     referencedColumnName: 'id',
  //   },
  // })
  // Pins: PinEntity[];

  @OneToMany(
    () => PinsPlaceKeywordEntity,
    (PinsPlaceKeywords) => PinsPlaceKeywords.PlaceKeywords,
    { cascade: true },
  )
  PinsPlaceKeywords: PinsPlaceKeywordEntity[];
}
