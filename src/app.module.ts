import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { EnvModule } from './configs/env.module';
import { RedisModule } from './configs/redis.module';
import { DatabaseModule } from './configs/database.module';
import { SessionMiddleware } from './middlewares/session.middleware';
import { UsersModule } from './modules/users/users.module';
import { ItemsModule } from './modules/items/items.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    RedisModule,

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
