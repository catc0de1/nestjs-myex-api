// import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { REDIS_CLIENT } from '@/constants/redis.constant';
// import Redis from 'ioredis';
// import * as session from 'express-session';
// import * as RedisStore from 'connect-redis';

// import type { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class SessionMiddleware implements NestMiddleware {
//   private sessionMiddleware: ReturnType<typeof session>;

//   constructor(
//     private readonly configService: ConfigService,

//     @Inject(REDIS_CLIENT)
//     private readonly redis: Redis,
//   ) {
//     const store = new RedisStore({
//       client: this.redis,
//       prefix: 'sess:',
//       ttl: Math.floor(this.configService.getOrThrow<number>('SESSION_TTL')),
//     });

//     this.sessionMiddleware = session({
//       store,
//       secret: this.configService.get<string>('SESSION_SECRET')!,
//       resave: false,
//       saveUninitialized: false,
//       rolling: true,
//       cookie: {
//         httpOnly: true,
//         maxAge: this.configService.get<number>('SESSION_TTL'),
//         secure: this.configService.get<string>('NODE_ENV') === 'production',
//         sameSite: 'lax',
//       },
//     });
//   }
//   use(req: Request, res: Response, next: NextFunction) {
//     this.sessionMiddleware(req, res, next);
//   }
// }
