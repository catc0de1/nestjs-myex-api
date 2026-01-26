import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { UsersService } from '@/modules/users/users.service';
import { REDIS_CLIENT } from '@/constants/redis.constant';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  private readonly pepper: string;

  constructor(
    private configService: ConfigService,

    private usersService: UsersService,

    private jwtService: JwtService,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {
    this.pepper = this.configService.get<string>('PEPPER_SECRET')!;
  }

  async signToken(sub: number, email: string) {
    const payload = {
      sub,
      email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow<number>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.getOrThrow<number>(
        'JWT_REFRESH_EXPIRES_IN',
      ),
    });

    await this.redis.set(
      `refresh:user:${sub}`,
      refreshToken,
      'EX',
      60 * 60 * 24 * 7,
    );

    // await this.jwtService.signAsync(payload);

    return { accessToken, refreshToken };
  }

  async createPassword(password: string): Promise<string> {
    return await hash(password + this.pepper);
  }

  async register(name: string, email: string, password: string) {
    const users = await this.usersService.findAll({ email });
    if (users.length) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const hashedPassword = await this.createPassword(password);

    const user = await this.usersService.create(name, email, hashedPassword);

    const token = await this.signToken(user.id, user.email);

    return { user, token };
  }

  async login(email: string, password: string) {
    const [user] = await this.usersService.findAll({ email });
    if (!user) {
      throw new NotFoundException('Email tidak ditemukan');
    }

    const isMatch = await verify(user.password, password + this.pepper);
    if (!isMatch) {
      throw new BadRequestException('Password salah');
    }

    const token = await this.signToken(user.id, user.email);

    return { user, token };
  }

  async logout(userId: number) {
    await this.redis.del(`refresh:user:${userId}`);
  }
}
