import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync } from 'fs';
import { join } from 'path';
import { User } from '@/modules/users/user.entity';
import { Item } from '@/modules/items/item.entity';
import { AuthService } from '@/modules/auth/auth.service';
import { ProdSeeder } from './prod.seed';

import type { UserSeedData } from './interfaces/user-seed.interface';
import type { ItemSeedData } from './interfaces/item-seed.interface';

@Injectable()
export class DevSeeder {
  private readonly logger = new Logger(DevSeeder.name);

  constructor(
    private readonly config: ConfigService,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,

    private readonly authService: AuthService,

    private readonly prodSeeder: ProdSeeder,
  ) {}

  private loadJson<T>(fileName: string): T[] {
    const filePath = join(__dirname, 'data', fileName);
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T[];
  }

  async run(): Promise<void> {
    if (this.config.get<string>('NODE_ENV') !== 'development') {
      throw new Error('Prod seed can only run in development');
    }

    this.logger.log('Running DEV seed');

    await this.prodSeeder.run();

    const usersData = this.loadJson<UserSeedData>('users.json');
    const itemsData = this.loadJson<ItemSeedData>('items.json');

    for (const userData of usersData) {
      const exists = await this.userRepo.findOneBy({
        email: userData.email,
      });

      if (exists) continue;

      const hashedPassword = await this.authService.createPassword(
        userData.password,
      );

      const savedUser = await this.userRepo.save({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        admin: userData.admin ?? false,
      });

      const savedUserId = savedUser.id;
      this.logger.log(`User created with ID: ${savedUserId}`);
    }

    for (const itemData of itemsData) {
      const user = await this.userRepo.findOneBy({
        email: itemData.userEmail,
      });

      if (!user) {
        this.logger.warn(`Skipping item "${itemData.name}", user not found`);
        continue;
      }

      const exists = await this.itemRepo.findOne({
        where: {
          name: itemData.name,
          user: { id: user.id },
        },
      });

      if (exists) continue;

      const savedItem = await this.itemRepo.save({
        name: itemData.name,
        description: itemData.description,
        price: itemData.price,
        location: itemData.location,
        category: itemData.category,
        approved: itemData.approved ?? false,
        user,
      });

      const savedItemId = savedItem.id;
      this.logger.log(`Item created with ID: ${savedItemId}`);
    }

    this.logger.log('DEV seed done');
  }
}
