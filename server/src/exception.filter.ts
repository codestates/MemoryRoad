import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import fs from 'fs';

//커스텀 에러 핸들링
//모든 타입의 예외를 catch한다
@Catch()
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (exception instanceof InternalServerErrorException) {
        //service 관련 에러
        //사진 파일 삭제
        if (request.files) {
          for (let i = 0; i < request.files.length; i++) {
            //동기적으로 파일 삭제
            fs.unlinkSync(`./${request.files[i].path}`);
          }
        }

        response.status(status).json({
          code: status,
          message: 'server error',
        });
      } else if (exception instanceof BadRequestException) {
        //class-validation실패
        if (request.files) {
          //사진 파일 삭제
          for (let i = 0; i < request.files.length; i++) {
            //동기적으로 파일 삭제
            fs.unlinkSync(`./${request.files[i].path}`);
          }
        }

        response.status(400).json({
          code: 400,
          message: exception.getResponse()['message'],
        });
      } else if (exception instanceof NotFoundException) {
        //없는 핀, 또는 다른 유저가 작성한 핀을 업데이트 하려는 경우
        if (request.files) {
          //사진 파일 삭제
          for (let i = 0; i < request.files.length; i++) {
            //동기적으로 파일 삭제
            fs.unlinkSync(`./${request.files[i].path}`);
          }
        }

        response.status(404).json({
          code: 404,
          message: 'not found',
        });
      }
    } else if (exception instanceof TypeError) {
      //multer의 에러 처리
      if (exception.message === 'bad img type') {
        response.status(400).json({
          code: 400,
          message: exception.message,
        });
      }
    }
  }
}
