import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_SERVER_ERROR';
    let message = 'Terjadi kesalahan pada sistem server.';
    let details: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resObj = exception.getResponse();
      if (typeof resObj === 'object' && resObj !== null) {
        const anyRes = resObj as any;
        errorCode = anyRes.error?.code || anyRes.error || exception.name;
        message = anyRes.error?.message || anyRes.message || message;
        details = anyRes.error?.details || anyRes.message;
      } else {
        message = String(resObj);
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorCode = exception.name;
    }

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details: Array.isArray(details) ? details : undefined,
      },
    });
  }
}

