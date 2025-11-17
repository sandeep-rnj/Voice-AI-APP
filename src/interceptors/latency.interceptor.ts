/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LatencyInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const latency = Date.now() - now;
        console.log(
          `${context.switchToHttp().getRequest().method} ${
            context.switchToHttp().getRequest().url
          } - Latency: ${latency}ms`,
        );
      }),
    );
  }
}
