import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpStatusCode } from 'axios';
import { RESPONSE_MESSAGE_KEY } from 'src/decorators/response-message.decorator';

@Injectable()
export class ResponseMessageInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const apiResponse = this.reflector.get<{
      message: string;
      statusCode?: HttpStatusCode;
    }>(RESPONSE_MESSAGE_KEY, context.getHandler());

    const request = context.switchToHttp().getRequest();
    const httpMethod = request.method;

    const status = httpMethod === 'POST' ? HttpStatus.CREATED : HttpStatus.OK;

    return next.handle().pipe(
      map((data) => {
        if (apiResponse) {
          return {
            statusCode: apiResponse?.statusCode || status,
            message: apiResponse.message,
            ...data,
          };
        }
        return data;
      }),
      catchError((error) => {
        if (error instanceof HttpException) {
          return throwError(() => error);
        }
        return throwError(
          () =>
            new HttpException(
              {
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                error: error,
              },
              HttpStatus.INTERNAL_SERVER_ERROR,
            ),
        );
      }),
    );
  }
}
