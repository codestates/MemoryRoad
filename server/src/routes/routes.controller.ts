import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Response, Express, Request } from 'express';
import { PatchRouteDto } from './dto/patchRoute.dto';
import { RoutesService } from './routes.service';
import { ExceptionFilter } from 'src/exception.filter';
import { multerOptions } from './routes.multerOpt';

@UseFilters(ExceptionFilter)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  //페이지네이션을 위해 'page'쿼리파라미터를 받는다.
  @Get()
  getRoutes(
    @Req() request: Request,
    @Query()
    query: {
      nwLat?: string;
      nwLng?: string;
      seLat?: string;
      seLng?: string;
      page?: string;
      search?: string;
      rq?: string;
      lq?: string;
      location?: string;
      time?: string;
    },
    // @Query('nwLat', ParseIntPipe) nwLat: number,
    // @Query('nwLng', ParseIntPipe) nwLng: number,
    // @Query('seLat', ParseIntPipe) seLat: number,
    // @Query('seLng', ParseIntPipe) seLng: number,
    // @Query('page', ParseIntPipe) page?: number,
    // @Query('search', ParseBoolPipe) search?: boolean,
    // @Query('rq') rq?: string,
    // @Query('lq') lq?: string,
    // @Query('location') location?: string,
    // @Query('time', ParseIntPipe) time?: number,
  ) {
    //validation pipe를 이용하면 파라미터를 선택적으로 받을 수 없거나 숫자가 아닌 값을 NaN로 파싱하고 타입을 number로 주는 문제가 있다. ParseIntPipe 등을 사용하지 않고 전부 문자열로 받았다.

    // 'search' 파라미터가 주어지지 않은 경우. 마이페이지에서 루트를 조회
    if (query.search !== 'true') {
      //nest의 표준 응답. 자바스크립트 객체 또는 배열을 반환하면 자동으로 JSON으로 직렬화된다.
      return this.routesService.getUserRoutes(
        query.page as unknown as number,
        request.cookies['accessToken'],
      );
    } else {
      //강제 형변환. string과 number는 부모-자식 관계가 아니기 때문에 앞에 unknown을 붙혀야 한다.
      return this.routesService.getSearchedRoutes(
        query.nwLat as unknown as number,
        query.nwLng as unknown as number,
        query.seLat as unknown as number,
        query.seLng as unknown as number,
        query.rq,
        query.lq,
        query.location,
        query.time as unknown as number,
        query.page as unknown as number,
      );
    }
  }

  //@Res의 { passthrough: true }옵션: nest의 방식과 express의 response객체를 동시에 사용
  //files에는 multer가 처리한 파일의 정보, req에는 JSON형식 문자열이 들어있다. JSON의 유효성 검사는 service에서 처리한다.
  @Post()
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async createRoute(
    @Body() req: { route: string },
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() request: Request,
  ) {
    await this.routesService.createRoute(
      req.route,
      files,
      request.cookies['accessToken'],
    );

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
    @Req() request: Request,
  ) {
    await this.routesService.updateRoute(
      routeId,
      route,
      request.cookies['accessToken'],
    );

    return res.status(200).json({
      code: 200,
      message: 'updated',
    });
  }

  //TODO: 해당 사용자가 작성한 루트만 삭제할 수 있어야 한다.
  // 루트를 삭제하면 루트를 참조하는 핀, 핀을 참조하는 사진들이 전부 삭제된다.(외래키에 on delete : cascade 속성이 있다.)
  @Delete('/:routeId')
  async deleteRoute(
    @Param('routeId') routeId: number,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    await this.routesService.deleteRoute(
      routeId,
      request.cookies['accessToken'],
    );

    return res.status(200).json({
      code: 200,
      message: 'deleted',
    });
  }

  //TODO: 해당 사용자가 작성한 루트의 핀들만 조회할 수 있어야 한다.
  //해당 루트의 핀들 조회
  @Get('/:routeId/pins')
  async getPins(
    @Param('routeId') routeId: number,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const pins = await this.routesService.getPins(
      routeId,
      request.cookies['accessToken'],
    );
    return res.status(200).json({
      code: 200,
      pins,
    });
  }

  //TODO: 해당 사용자가 작성한 루트의 핀들만 업데이트 할 수 있어야 한다.
  //루트의 핀 업데이트. 사진은 추가만 가능하다.
  @Patch('/:routeId/pins/:pinId')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async updatePin(
    @Param('routeId') routeId: number,
    @Param('pinId') pinId: number,
    @Body() req: { pin: string },
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() request: Request,
  ) {
    //JSON.parse, 유효성 검증 에러를 처리하기 위해 try-catch문을 컨트롤러에서도 사용했다. 서비스 부분에 JSON문자열을 넘겨줘 처리하는 것 생각해 보기

    await this.routesService.updatePin(
      routeId,
      pinId,
      req.pin,
      files,
      request.cookies['accessToken'],
    );

    return res.status(200).json({
      code: 200,
      message: 'updated',
    });
  }

  //핀과 핀을 참조하는 사진들을 삭제한다.
  @Delete('/:routeId/pins/:pinId')
  async deletePin(
    @Param('routeId') routeId: number,
    @Param('pinId') pinId: number,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    await this.routesService.deletePin(
      routeId,
      pinId,
      request.cookies['accessToken'],
    );

    return res.status(200).json({
      code: 200,
      message: 'deleted',
    });
  }

  //해당 루트에 핀을 새로 생성한다.
  //filesInterceptor는 세 가지 인자를 받는다. 첫 번째 인자는 HTML양식에서 필드 이름이다.
  //두 번째 인자는 업로드 가능한 파일의 숫자이다(10개)
  //세 번째 인자는 multer옵션 객체이다.(저장 경로, 파일명 등 지정)

  //multer가 body에서 파일들을 분리해 내기 때문에 nestjs-form-data모듈의 DTO유효성 검사와 충돌이 난다.
  //이미지의 유효성 검사는 multer의 filter옵션에서 처리하고, 다른 key, value의 유효성 검사는 class-validator에서 처리한다.
  @Post('/:routeId/pins')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async createPin(
    @Param('routeId') routeId: number,
    @Body() req: { pin: string },
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() request: Request,
  ) {
    await this.routesService.createPin(
      routeId,
      req.pin,
      files,
      request.cookies['accessToken'],
    );
    return res.status(201).json({
      code: 201,
      message: 'created',
    });
  }

  //핀의 사진을 삭제한다.
  @Delete('/:routeId/pins/:pinId/pictures/:pictureId')
  async deletePicture(
    @Param('routeId') routeId: number,
    @Param('pinId') pinId: number,
    @Param('pictureId') pictureId: number,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    await this.routesService.deletePicture(
      routeId,
      pinId,
      pictureId,
      request.cookies['accessToken'],
    );
    return res.status(200).json({
      code: 200,
      message: 'deleted',
    });
  }
}
