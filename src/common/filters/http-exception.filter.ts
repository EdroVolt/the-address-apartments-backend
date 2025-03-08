import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let error = exception;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse() as Record<
        string,
        unknown
      >;
      message =
        typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? Array.isArray(exceptionResponse.message)
            ? String(exceptionResponse.message[0])
            : String(exceptionResponse.message)
          : exception.message;
      error = exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    console.error(`[Exception] ${request.method} ${request.url}:`, exception);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: process.env.NODE_ENV === 'production' ? undefined : error,
    });
  }
}
