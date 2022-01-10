import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { PinEntity } from './pin.entity';

@Entity('PlaceKeywords')
export class PlaceKeywordEntity {
  @PrimaryColumn()
  @ManyToMany((type) => PinEntity, { cascade: true })
  keyword: string;
}
