import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class AllowedUpdatesInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const req: Request = context.switchToHttp().getRequest();
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'email', 'age'];
    const isValidate = updates.every(update => allowedUpdates.includes(update));
    console.log('TCL: AllowedUpdatesInterceptor -> isValidate', isValidate);
    if (!isValidate) {
      return throwError(new BadRequestException().message);
    }
    return next.handle().pipe(tap(() => console.log(`allowedUpdates`)));
  }
}
