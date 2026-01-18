import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

export const CurrentSession = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    return request.session.userId;
  },
);
