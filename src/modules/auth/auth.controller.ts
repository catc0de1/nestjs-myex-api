import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  SIGNIN_THROTTLE,
  SIGNUP_THROTTLE,
} from '@/constants/throttle.constant';
import { Serialize } from '@/interceptors/serialize.interceptor';
import { AuthGuard } from '@/guards/auth.guard';
import { CurrentSession } from '@/modules/auth/decorators/current-session.decorator';
import { AuthResponseDto } from '@/modules/auth/dtos/auth-response.dto';
import { CreateUserDto } from '@/modules/users/dtos/create-user.dto';
import { AuthService } from '@/modules/auth/auth.service';
import { LoginUserDto } from '@/modules/auth/dtos/login-user.dto';
import { User } from '@/modules/users/user.entity';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: SIGNUP_THROTTLE })
  @Post('/register')
  @Serialize(AuthResponseDto)
  async register(@Body() body: CreateUserDto, @Req() req: Request) {
    const user = await this.authService.register(
      body.name,
      body.email,
      body.password,
    );

    req.session.userId = user.id;
    // console.log(req.session.userId);

    return { message: 'Register successfully', user };
  }

  @Throttle({ default: SIGNIN_THROTTLE })
  @Post('/login')
  @Serialize(AuthResponseDto)
  async login(@Body() body: LoginUserDto, @Req() req: Request) {
    const user = await this.authService.login(body.email, body.password);

    req.session.userId = user.id;
    // console.log(req.session.userId);

    return { message: 'Login successfully', user };
  }

  @Post('/logout')
  async logout(@Req() req: Request) {
    // console.log('logout sessionID:', req.sessionID);
    // console.log('logout session:', req.session);
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new BadRequestException('Logout failed'));
        }
        resolve({ message: 'Logout successfully' });
      });
    });
  }

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentSession() user: User) {
    return user;
  }
}
