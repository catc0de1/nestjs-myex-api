import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';
import * as session from 'express-session';

import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class SessionMiddleware implements NestMiddleware {
  private sessionMiddleware: ReturnType<typeof session>;

  constructor(private readonly configService: ConfigService) {
    const redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      password: this.configService.get<string>('REDIS_PASSWORD'),
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });

    redisClient.connect().catch(console.error);

    const store = new RedisStore({
      client: redisClient,
      prefix: 'sess:',
      ttl: Math.floor(this.configService.getOrThrow<number>('SESSION_TTL')),
    });

    this.sessionMiddleware = session({
      store,
      secret: this.configService.get<string>('SESSION_SECRET')!,
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        httpOnly: true,
        maxAge: this.configService.get<number>('SESSION_TTL'),
        secure: this.configService.get<string>('NODE_ENV') === 'production',
        sameSite: 'lax',
      },
    });
  }
  use(req: Request, res: Response, next: NextFunction) {
    this.sessionMiddleware(req, res, next);
  }
}
