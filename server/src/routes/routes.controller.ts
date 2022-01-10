import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Response, Express } from 'express';
import { PatchPinDto } from './dto/patchPin.dto';
import { PatchRouteDto } from './dto/patchRoute.dto';
import { PostRouteDto } from './dto/postRoute.dto';
import { RoutesService } from './routes.service';
import { ExceptionFilter } from 'src/exception.filter';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { multerOptions } from './routes.multerOpt';

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

  //@Res의 { passthrough: true }옵션: nest의 방식과 express의 response객체를 동시에 사용
  //files에는 multer가 처리한 파일의 정보, req에는 JSON형식 문자열이 들어있다. JSON의 유효성 검사는 service에서 처리한다.
  @Post()
  @UseFilters(ExceptionFilter)
  @UseInterceptors(AnyFilesInterceptor(multerOptions))
  async createRoute(
    @Body() req: { route: string },
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.routesService.createRoute(req.route, files);

    return res.status(201).json({
      code: 201,
      message: 'created',
    });
  }

  //path 파라미터를 받는다.
  @Patch('/:routeId')
  @UseFilters(ExceptionFilter)
  async updateRoute(
    @Param('routeId') routeId: number,
    @Body() route: PatchRouteDto,
    @Res() res: Response,
  ) {
    await this.routesService.updateRoute(routeId, route);

    return res.status(200).json({
      code: 200,
      message: 'updated',
    });
  }

  //TODO: 해당 사용자가 작성한 루트만 삭제할 수 있어야 한다.
  // 루트를 삭제하면 루트를 참조하는 핀, 핀을 참조하는 사진들이 전부 삭제된다.(외래키에 on delete : cascade 속성이 있다.)
  @Delete('/:routeId')
  async deleteRoute(@Param('routeId') routeId: number, @Res() res: Response) {
    await this.routesService.deleteRoute(routeId);

    return res.status(200).json({
      code: 200,
      message: 'deleted',
    });
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

  //TODO: 해당 사용자가 작성한 루트의 핀들만 업데이트 할 수 있어야 한다.
  //루트의 핀 업데이트. 사진은 추가만 가능하다.
  @UseFilters(ExceptionFilter)
  @Patch('/:routeId/pins/:pinId')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async updatePin(
    @Param('routeId') routeId: number,
    @Param('pinId') pinId: number,
    @Body() req: { pin: string },
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    //JSON.parse, 유효성 검증 에러를 처리하기 위해 try-catch문을 컨트롤러에서도 사용했다. 서비스 부분에 JSON문자열을 넘겨줘 처리하는 것 생각해 보기
    try {
      //문자열 JSON을 parse한 뒤, PatchPinDto타입의 객체를 생성한다.
      const pin = plainToClass(PatchPinDto, JSON.parse(req.pin));

      //새로 생성한 객체의 유효성 검증
      const error = await validate(pin, { forbidUnknownValues: true });
      if (error.length > 0) {
        const fstVal =
          error[0].constraints[Object.keys(error[0].constraints)[0]];
        throw new BadRequestException(null, fstVal);
      }
      await this.routesService.updatePin(routeId, pinId, pin, files);

      return res.status(200).json({
        code: 200,
        message: 'updated',
      });
    } catch (err) {
      if (err.status === 404) {
        throw new NotFoundException();
      } else if (err.status === 400 || err instanceof SyntaxError) {
        //잘못된 JSON 형식을 받을 경우
        throw new BadRequestException(null, err.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  //TODO: 해당 사용자가 작성한 핀만 삭제할 수 있어야 한다.(유저의 루트 소유여부를 확인, service에서 에러를 throw한다)
  //핀과 핀을 참조하는 사진들을 삭제한다.
  @UseFilters(ExceptionFilter)
  @Delete('/:routeId/pins/:pinId')
  async deletePin(
    @Param('routeId') routeId: number,
    @Param('pinId') pinId: number,
    @Res() res: Response,
  ) {
    await this.routesService.deletePin(routeId, pinId);

    return res.status(200).json({
      code: 200,
      message: 'deleted',
    });
  }

  //TODO: 해당 사용자가 작성한 루트의 핀만 생성할 수 있다. 사진도 같이 추가하기
  //해당 루트에 핀을 새로 생성한다.
  //filesInterceptor는 세 가지 인자를 받는다. 첫 번째 인자는 HTML양식에서 필드 이름이다.
  //두 번째 인자는 업로드 가능한 파일의 숫자이다(10개)
  //세 번째 인자는 multer옵션 객체이다.(저장 경로, 파일명 등 지정)

  //multer가 body에서 파일들을 분리해 내기 때문에 nestjs-form-data모듈의 DTO유효성 검사와 충돌이 난다.
  //이미지의 유효성 검사는 multer의 filter옵션에서 처리하고, 다른 key, value의 유효성 검사는 class-validator에서 처리한다.
  @UseFilters(ExceptionFilter)
  @Post('/:routeId/pins')
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async createPin(
    @Param('routeId') routeId: number,
    @Body() req: { pin: string },
    @Res() res: Response,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    //JSON.parse의 에러를 처리하기 위해 try-catch문을 컨트롤러에서도 사용했다. 서비스 부분에 JSON문자열을 넘겨줘 처리하는 것 생각해 보기
    try {
      //문자열 JSON을 parse한 뒤, PatchPinDto타입의 객체를 생성한다.
      const pin = plainToClass(PatchPinDto, JSON.parse(req.pin));

      //새로 생성한 객체의 유효성 검증
      const error = await validate(pin, { forbidUnknownValues: true });
      if (error.length > 0) {
        const fstVal =
          error[0].constraints[Object.keys(error[0].constraints)[0]];
        throw new BadRequestException(null, fstVal);
      }

      await this.routesService.createPin(routeId, pin, files);
      return res.status(201).json({
        code: 201,
        message: 'created',
      });
    } catch (err) {
      if (err.status === 400 || err instanceof SyntaxError) {
        //잘못된 JSON 형식을 받을 경우
        throw new BadRequestException(null, err.message);
      } else {
        throw new InternalServerErrorException(null, err.message);
      }
    }
  }
}
