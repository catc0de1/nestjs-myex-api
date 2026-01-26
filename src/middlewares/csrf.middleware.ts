import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { doubleCsrfProtection } from '@/modules/csrf/common/csrf-csrf';
import { CSRF_SKIP_PATHS } from '@/constants/csrf.constant';

import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (CSRF_SKIP_PATHS.includes(req.path)) return next();

    try {
      doubleCsrfProtection(req, res, next);
      this.logger.debug(
        {
          cookies: req.cookies?.csrf as string,
          header: req.headers['x-csrf-token'],
          sessionId: req.sessionID,
        },
        'CSRF DEBUG',
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        this.logger.warn(
          { path: req.path, method: req.method, error: err },
          'CSRF validation failed',
        );
        throw new ForbiddenException('Invalid CSRF token');
      } else {
        throw err;
      }
    }
  }
}
