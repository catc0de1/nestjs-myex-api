import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: 60_000,
            limit: 100,
          },
        ],

        errorMessage: 'Limit Reached, Try Again Later',

        storage: new ThrottlerStorageRedisService(
          `redis://:${config.get<string>('REDIS_PASSWORD')}@${config.get<string>('REDIS_HOST')}:${config.get<number>('REDIS_PORT')}`,
        ),
      }),
    }),
  ],
})
export class ThrottleModule {}
