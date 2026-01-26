import { Controller, Get, HttpCode, Inject } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.provider';
import { REDIS_CLIENT } from '@/constants/redis.constant';
import Redis from 'ioredis';

import type { HealthCheckResult } from '@nestjs/terminus';

@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,

    private readonly dbIndicator: TypeOrmHealthIndicator,

    private readonly redisIndicator: RedisHealthIndicator,

    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  @Get()
  @HttpCode(200)
  apiCheck(): void {
    return;
  }

  @Get('database')
  @HealthCheck()
  async dbCheck(): Promise<HealthCheckResult> {
    return await this.health.check([
      () => this.dbIndicator.pingCheck('database'),
    ]);
  }

  @Get('redis')
  @HealthCheck()
  async redisCheck(): Promise<HealthCheckResult> {
    return await this.health.check([
      () => this.redisIndicator.pingCheck('redis', this.redis),
    ]);
  }
}
