import { Controller, Get, Query } from '@nestjs/common';
import { query } from 'express';
import { RouteEntity } from './entities/route.entity';
import { RoutesService } from './routes.service';

@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  //페이지네이션을 위해 'page'쿼리파라미터를 받는다.
  @Get()
  getRoutes(
    @Query()
    query: {
      page: number;
      rq?: string;
      lq?: string;
      location?: string;
      time?: number;
    },
  ): Promise<object> {
    //nest의 표준 응답. 자바스크립트 객체 또는 배열을 반환하면 자동으로 JSON으로 직렬화된다.
    return this.routesService.getUserRoutes(query.page);
  }
}
