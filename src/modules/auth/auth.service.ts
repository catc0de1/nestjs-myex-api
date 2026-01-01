import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash, verify } from 'argon2';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class AuthService {
  private readonly pepper: string;

  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.pepper = this.configService.get<string>('PEPPER_SECRET')!;
  }

  async register(name: string, email: string, password: string) {
    const users = await this.usersService.findAll({ email });
    if (users.length) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    const hashedPassword = await hash(password + this.pepper);

    const user = await this.usersService.create(name, email, hashedPassword);

    return user;
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

    return user;
  }
}
