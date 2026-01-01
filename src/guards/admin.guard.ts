import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import type { User } from '@/modules/users/user.entity';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user: User | undefined = request.currentUser;

    if (!user) {
      throw new ForbiddenException('You are not logged in!');
    }

    if (!user.admin) {
      throw new ForbiddenException('Only admins can access this resource!');
    }

    return true;
  }
}
