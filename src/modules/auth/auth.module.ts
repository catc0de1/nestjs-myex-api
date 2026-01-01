import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersModule } from '@/modules/users/users.module';
import { CurrentUserMiddleware } from '@/modules/auth/middlewares/current-user.middleware';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: 'items/:id',
      method: RequestMethod.PATCH,
    });
  }
}
