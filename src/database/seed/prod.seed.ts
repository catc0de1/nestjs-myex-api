import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@/modules/users/user.entity';
import { AuthService } from '@/modules/auth/auth.service';

@Injectable()
export class ProdSeeder {
  private readonly logger = new Logger(ProdSeeder.name);

  constructor(
    private readonly config: ConfigService,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly authService: AuthService,
  ) {}

  async run(): Promise<void> {
    this.logger.log('Running PROD seed');

    const adminExist = await this.userRepo.findOneBy({ admin: true });
    if (!adminExist) {
      const password = this.config.getOrThrow<string>('ADMIN_PASSWORD_SEED');
      const hashedPassword = await this.authService.createPassword(password);

      const savedAdmin = await this.userRepo.save({
        name: 'Admin',
        email: this.config.get<string>('ADMIN_EMAIL_SEED'),
        password: hashedPassword,
        admin: true,
      });

      const savedAdminId = savedAdmin.id;
      this.logger.log(`Admin created with ID: ${savedAdminId}`);
    } else {
      const adminExistId = adminExist.id;
      this.logger.log(`Admin already exists with ID: ${adminExistId}`);
    }

    this.logger.log('PROD seed done');
  }
}
