import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PinEntity } from './pin.entity';

@Entity('Pictures')
export class PictureEntity {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => PinEntity, (Pins) => Pins.id)
  @JoinColumn({ name: 'pinId' })
  Pins: PinEntity;

  @Column()
  ranking: number;

  @Column({ length: 45 })
  fileName: string;
}
