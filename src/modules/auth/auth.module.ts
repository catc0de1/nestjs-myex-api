import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { UsersModule } from '@/modules/users/users.module';
import { CurrentUserMiddleware } from '@/modules/auth/middlewares/current-user.middleware';
import { JwtModule } from './jwt.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule,
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes({
      path: 'items/:id',
      method: RequestMethod.PATCH,
    });
  }
}
