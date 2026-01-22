import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

type ClassConstructor<T> = {
  new (...args: unknown[]): T;
};

// if you want to restrict to only object types
// interface ClassConstructor {
//   new (...args: any[]): object;
// }

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

@Injectable()
export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<T | T[]> | Promise<Observable<T>> {
    // Run something before a request is handled by the request handler
    // console.log('Running before the handler', context);
    return next.handle().pipe(
      map((data: T | T[]) => {
        // Run something before the response is sent out or after the request is handled by the request handler
        // console.log('Running after the handler', data);

        return plainToInstance(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
