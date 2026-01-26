import {
  // MiddlewareConsumer,
  Module,
  // NestModule,
  // RequestMethod,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { EnvModule } from './core/env.module';
import { LoggerModule } from './core/logger.module';
import { DatabaseModule } from './core/database.module';
import { RedisModule } from './core/redis.module';
import { ThrottleModule } from './core/throttle.module';
// import { SessionMiddleware } from './middlewares/session.middleware';
import { CsrfModule } from './modules/csrf/csrf.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ItemsModule } from './modules/items/items.module';
import { ThrottleGuard } from './guards/throttle.guard';
// import { CsrfMiddleware } from './middlewares/csrf.middleware';

@Module({
  imports: [
    EnvModule,
    LoggerModule,
    DatabaseModule,
    RedisModule,
    ThrottleModule,

    CsrfModule,
    HealthModule,
    UsersModule,
    AuthModule,
    ItemsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottleGuard,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  // consumer.apply(SessionMiddleware).forRoutes('*');
  // consumer
  //   .apply(CsrfMiddleware)
  //   .forRoutes({ path: '*', method: RequestMethod.ALL });
  // }
}
