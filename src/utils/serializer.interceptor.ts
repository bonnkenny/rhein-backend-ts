import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import deepResolvePromises from './deep-resolver';

@Injectable()
export class ResolvePromisesInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ResolvePromisesInterceptor.name);
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // return next.handle().pipe(map((data) => deepResolvePromises(data)));

    return next.handle().pipe(
      map(async (data) => {
        try {
          console.log('11111 data', data);
          return await deepResolvePromises(data);
        } catch (error) {
          console.log('11111 Error', error);
          this.logger.error(
            `Error in deepResolvePromises: ${error.message}`,
            error.stack,
          );
          throw error;
        }
      }),
      catchError((error) => {
        console.log('22222 Error', error);
        this.logger.error(
          `Error in ResolvePromisesInterceptor: ${error.message}`,
          error.stack,
        );
        return throwError(() => error);
      }),
    );
  }
}
