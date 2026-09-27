import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.url.split('?')[0] ?? request.url;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      this.logger.error(`Prisma error ${exception.code}`);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'Не удалось выполнить запрос',
        path,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const { message, error } = this.readHttpBody(body, status);
      response.status(status).json({
        statusCode: status,
        error,
        message: this.sanitize(message),
        path,
      });
      return;
    }

    if (exception instanceof Error) {
      this.logger.error(exception.name);
    } else {
      this.logger.error('Unhandled exception');
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Не удалось выполнить запрос',
      path,
    });
  }

  private readHttpBody(
    body: string | object,
    status: number,
  ): { message: string | string[]; error: string } {
    if (typeof body === 'string') {
      return { message: body, error: HttpStatus[status] ?? 'Error' };
    }

    const record = body as Record<string, unknown>;
    const message = record.message;
    const error =
      typeof record.error === 'string'
        ? record.error
        : (HttpStatus[status] ?? 'Error');

    if (typeof message === 'string' || Array.isArray(message)) {
      return {
        message: message as string | string[],
        error,
      };
    }

    return { message: 'Не удалось выполнить запрос', error };
  }

  private sanitize(message: string | string[]): string | string[] {
    if (Array.isArray(message)) {
      return message.map((item) => this.sanitizeString(item));
    }
    return this.sanitizeString(message);
  }

  private sanitizeString(message: string): string {
    if (/accessToken|refreshToken|passwordHash|authorization/i.test(message)) {
      return 'Не удалось выполнить запрос';
    }
    return message;
  }
}
