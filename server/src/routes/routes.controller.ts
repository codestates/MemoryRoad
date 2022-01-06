import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { PatchRouteDto } from './dto/patchRoute.dto';
import { PostRouteDto } from './dto/postRoute.dto';
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

  //{ passthrough: true }옵션: nest의 방식과 express의 response객체를 동시에 사용
  //응답코드가 고정되어 있지 않아 @Res 데코레이터를 사용하고, 응답 객체를 controller에서 만들었다.
  @Post()
  createRoute(@Body() routePins: PostRouteDto, @Res() res: Response) {
    try {
      this.routesService.createRoute(routePins);
    } catch (err) {
      return res.status(500).json({
        code: 500,
        message: 'server error',
      });
    }

    return res.status(201).json({
      code: 201,
      message: 'created',
    });
  }

  //path 파라미터를 받는다.
  @Patch('/:routeId')
  async updateRoute(
    @Param('routeId') routeId: number,
    @Body() route: PatchRouteDto,
    @Res() res: Response,
  ) {
    //TODO: 해당 사용자가 작성한 루트만 수정할 수 있어야 한다.
    try {
      const updateResult = await this.routesService.updateRoute(routeId, route);
      if (!updateResult.affected) {
        //없는 루트, 또는 다른 유저가 작성한 루트를 업데이트 하려는 경우
        return res.status(404).json({
          code: 404,
          message: 'not found',
        });
      }

      return res.status(200).json({
        code: 200,
        message: 'updated',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        code: 500,
        message: 'server error',
      });
    }
  }

  //TODO: 해당 사용자가 작성한 루트만 삭제할 수 있어야 한다.
  // 루트를 삭제하면 루트를 참조하는 핀, 핀을 참조하는 사진들이 전부 삭제된다.(외래키에 on delete : cascade 속성이 있다.)
  @Delete('/:routeId')
  async deleteRoute(@Param('routeId') routeId: number, @Res() res: Response) {
    try {
      const deleteResult = await this.routesService.deleteRoute(routeId);
      if (!deleteResult.affected) {
        //없는 루트, 또는 다른 유저가 작성한 루트를 삭제 하려는 경우
        return res.status(404).json({
          code: 404,
          message: 'not found',
        });
      }

      return res.status(200).json({
        code: 200,
        message: 'deleted',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        code: 500,
        message: 'server error',
      });
    }
  }

  //TODO: 해당 사용자가 작성한 루트의 핀들만 조회할 수 있어야 한다.
  //해당 루트의 핀들 조회
  @Get('/:routeId/pins')
  async getPins(@Param('routeId') routeId: number, @Res() res: Response) {
    try {
      const pins = await this.routesService.getPins(routeId);
      return res.status(200).json({
        code: 200,
        pins,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        code: 500,
        message: 'server error',
      });
    }
  }
}
