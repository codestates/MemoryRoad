import { Entity, PrimaryColumn, ManyToMany, JoinTable, Column } from 'typeorm';
import { RouteEntity } from '../../routes/entities/route.entity';

@Entity('Wards')
export class WardEntity {
  @PrimaryColumn({ length: 45 })
  id: string;

  @Column()
  routesNumber: number;

  //M:N 조인테이블 설정.
  @ManyToMany(() => RouteEntity, (Routes) => Routes.id, { cascade: true })
  @JoinTable({
    name: 'RoutesWards',
    joinColumn: {
      name: 'wardId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'routeId',
      referencedColumnName: 'id',
    },
  })
  Routes: RouteEntity[];
}
