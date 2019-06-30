import { BadRequestException } from './../exeptions/bad-request';
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpCode } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException)
export class BadRequestFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = HttpStatus.FORBIDDEN;

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      message: exception.message,
    };

    response
      .status(status)
      .json(errorResponse);
  }
}
