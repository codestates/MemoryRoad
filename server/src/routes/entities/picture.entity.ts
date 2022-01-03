import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PinEntity } from './pin.entity';

@Entity('Pictures')
export class PictureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PinEntity, (Pins) => Pins.id)
  @JoinColumn({ name: 'pinId' })
  Pins: PinEntity;

  @Column()
  pinId: number;

  @Column()
  ranking: number;

  @Column({ length: 45 })
  fileName: string;
}
