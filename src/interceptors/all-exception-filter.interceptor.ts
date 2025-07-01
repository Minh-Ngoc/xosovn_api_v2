import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if the exception is an instance of HttpException
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Get the message from the exception, or use a default message
    const exceptionData =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorData =
      typeof exceptionData === 'string'
        ? {
            message: exceptionData,
          }
        : exceptionData;

    // Format the response object
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
      ...errorData,
    };

    response.status(status).send(errorResponse);
  }
}
