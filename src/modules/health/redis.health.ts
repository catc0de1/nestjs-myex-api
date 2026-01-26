import { Inject, Injectable } from '@nestjs/common';
import type { RedisClientType } from 'redis';
import type { HealthIndicatorResult } from '@nestjs/terminus';

import { REDIS_CLIENT } from '@/constants/redis.constant';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: RedisClientType,
  ) {}

  async check(key = 'redis'): Promise<HealthIndicatorResult> {
    try {
      const result = await this.redis.ping();

      if (result !== 'PONG') {
        throw new Error('Redis ping failed');
      }

      return {
        [key]: {
          status: 'up',
        },
      };
    } catch {
      return {
        [key]: {
          status: 'down',
        },
      };
    }
  }
}
