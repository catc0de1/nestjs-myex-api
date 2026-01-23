import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvModule } from '@/core/env.module';
import { DatabaseModule } from '@/core/database.module';
import { User } from '@/modules/users/user.entity';
import { Item } from '@/modules/items/item.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { DevSeeder } from './dev.seed';
import { ProdSeeder } from './prod.seed';

@Module({
  imports: [
    EnvModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User, Item]),
    AuthModule,
  ],
  providers: [DevSeeder, ProdSeeder],
})
export class SeedModule {}
