import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PinEntity } from './pin.entity';

@Entity('Pictures')
export class PictureEntity {
  @PrimaryGeneratedColumn()
  id: number;

  //참조하는 핀이 삭제되면 같이 삭제된다.
  @ManyToOne(() => PinEntity, (Pins) => Pins.Pictures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pinId' })
  Pins: PinEntity;

  @Column()
  pinId: number;

  @Column({ length: 47 })
  fileName: string;
}
