import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity('Wards')
export class Wards {
  @PrimaryColumn({ length: 45 })
  id: string;

  @Column()
  routesNumber: number;
}
