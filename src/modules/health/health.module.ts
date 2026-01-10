import { Module } from '@nestjs/common';
import { TerminusModule, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisHealthModule } from '@liaoliaots/nestjs-redis-health';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { HealthController } from './health.controller';

@Module({
  imports: [TerminusModule, RedisModule, RedisHealthModule],
  controllers: [HealthController],
  providers: [TypeOrmHealthIndicator],
})
export class HealthModule {}
