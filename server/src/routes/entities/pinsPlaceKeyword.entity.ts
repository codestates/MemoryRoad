import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PinEntity } from './pin.entity';
import { PlaceKeywordEntity } from './placeKeyword.entity';

@Entity('PinsPlaceKeywords')
export class PinsPlaceKeywordEntity {
  @PrimaryColumn()
  keyword: string;

  @PrimaryColumn()
  pinId: number;

  @ManyToOne(() => PinEntity, (Pins) => Pins.PinsPlaceKeywords, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'pinId' })
  Pins: PinEntity;

  @ManyToOne(
    () => PlaceKeywordEntity,
    (PlaceKeywords) => PlaceKeywords.PinsPlaceKeywords,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'keyword' })
  PlaceKeywords: PlaceKeywordEntity;
}
