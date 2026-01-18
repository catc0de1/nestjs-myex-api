import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { EnvModule } from './core/env.module';
import { LoggerModule } from './core/logger.module';
import { DatabaseModule } from './core/database.module';
import { RedisModule } from './core/redis.module';
import { SessionMiddleware } from './middlewares/session.middleware';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ItemsModule } from './modules/items/items.module';

@Module({
  imports: [
    EnvModule,
    LoggerModule,
    DatabaseModule,
    RedisModule,

    HealthModule,
    UsersModule,
    AuthModule,
    ItemsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SessionMiddleware).forRoutes('*');
  }
}
