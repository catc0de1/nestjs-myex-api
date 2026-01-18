import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

import type { Request, Response, NextFunction, RequestHandler } from 'express';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private sessionMiddleware: RequestHandler;

  constructor(private readonly configService: ConfigService) {
    const redisClient = createClient({
      socket: {
        host: this.configService.get<string>('REDIS_HOST'),
        port: this.configService.get<number>('REDIS_PORT'),
      },
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    redisClient.connect().catch(console.error);

    const store = new RedisStore({
      client: redisClient,
      prefix: 'sess:',
    });

    this.sessionMiddleware = session({
      store,
      secret: this.configService.get<string>('SESSION_SECRET')!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: this.configService.get<number>('SESSION_TTL'),
        secure: false,
      },
    });
  }
  use(req: Request, res: Response, next: NextFunction) {
    this.sessionMiddleware(req, res, next);
  }
}
