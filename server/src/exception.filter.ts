import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import fs from 'fs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

//커스텀 에러 핸들링
//모든 타입의 예외를 catch한다
@Catch()
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.log(exception);
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
      } else if (
        exception instanceof BadRequestException ||
        exception instanceof SyntaxError
      ) {
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
      } else if (exception instanceof UnauthorizedException) {
        //없는 핀, 루트, 또는 다른 유저가 작성한 핀, 루트를 업데이트 하려는 경우
        if (request.files) {
          //사진 파일 삭제
          for (let i = 0; i < request.files.length; i++) {
            //동기적으로 파일 삭제
            fs.unlinkSync(`./${request.files[i].path}`);
          }
        }

        response.status(401).json({
          code: 401,
          message: 'unauthorized',
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
    } else if (exception instanceof JsonWebTokenError) {
      //토큰의 유효기간이 경과한 경우
      if (exception instanceof TokenExpiredError) {
        if (request.files) {
          //사진 파일 삭제
          for (let i = 0; i < request.files.length; i++) {
            //동기적으로 파일 삭제
            fs.unlinkSync(`./${request.files[i].path}`);
          }
        }

        return response.status(401).json({
          code: 401,
          message: 'expired token',
        });
      }
      if (request.files) {
        //사진 파일 삭제
        for (let i = 0; i < request.files.length; i++) {
          //동기적으로 파일 삭제
          fs.unlinkSync(`./${request.files[i].path}`);
        }
      }
      response.status(401).json({
        code: 401,
        message: 'unauthorized',
      });
    } else {
      response.status(500).json({
        code: 500,
        message: 'server error',
      });
    }
  }
}
