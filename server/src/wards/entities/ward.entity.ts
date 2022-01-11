import { Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { RouteEntity } from '../../routes/entities/route.entity';

@Entity('Users')
export class WardEntity {
  @PrimaryColumn({ length: 45 })
  id: string;

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
