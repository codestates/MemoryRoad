import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { PinEntity } from './pin.entity';

@Entity('PlaceKeywords')
export class PlaceKeywordEntity {
  @PrimaryColumn()
  keyword: string;

  //M:N 조인테이블 설정.
  @ManyToMany(() => PinEntity, (Pins) => Pins.id, { cascade: true })
  @JoinTable({
    name: 'PinsPlaceKeywords',
    joinColumn: {
      name: 'keyword',
      referencedColumnName: 'keyword',
    },
    inverseJoinColumn: {
      name: 'pinId',
      referencedColumnName: 'id',
    },
  })
  Pins: PinEntity[];
}
