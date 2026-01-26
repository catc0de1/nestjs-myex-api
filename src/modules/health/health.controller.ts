import { Controller, Get, HttpCode } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { RedisHealthIndicator } from './redis.health';

import type { HealthCheckResult } from '@nestjs/terminus';

@SkipThrottle()
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,

    private readonly dbIndicator: TypeOrmHealthIndicator,

    private readonly redisIndicator: RedisHealthIndicator,
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
    return await this.health.check([() => this.redisIndicator.check('redis')]);
  }
}
