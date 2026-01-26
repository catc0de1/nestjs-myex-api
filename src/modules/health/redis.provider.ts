import { Injectable } from '@nestjs/common';
import { HealthIndicatorService } from '@nestjs/terminus';
import Redis from 'ioredis';

import type { HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class RedisHealthIndicator {
  constructor(private readonly health: HealthIndicatorService) {}

  async pingCheck(
    key: string,
    client: Redis,
    timeout = 500,
  ): Promise<HealthIndicatorResult> {
    try {
      const pingPromise = client.ping();

      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Redis ping timeout'));
        }, timeout);
      });

      const result = await Promise.race([pingPromise, timeoutPromise]);

      if (result !== 'PONG') {
        throw new Error(`Unexpected Redis response: ${String(result)}`);
      }

      return this.health.check(key).up();
    } catch (err) {
      return this.health.check(key).down((err as Error).message);
    }
  }
}
