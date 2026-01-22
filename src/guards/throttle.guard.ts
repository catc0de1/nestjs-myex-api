import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

import type { Request } from 'express';

@Injectable()
export class ThrottleGuard extends ThrottlerGuard {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getTracker(req: Record<string, any>): Promise<string> {
    const request = req as Request;

    if (request.session?.userId) {
      return Promise.resolve(
        `${request.ip ?? 'unknown'}-${request.session.userId}`,
      );
    }

    return Promise.resolve(request.ip ?? 'unknown');
  }
}
