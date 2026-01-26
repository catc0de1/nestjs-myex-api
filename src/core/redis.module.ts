// Redis with liaoliaots package
// import { Global, Module } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { RedisModule as NestRedisModule } from '@liaoliaots/nestjs-redis';
//
// @Global()
// @Module({
//   imports: [
//     NestRedisModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         config: {
//           host: configService.get<string>('REDIS_HOST'),
//           port: configService.get<number>('REDIS_PORT'),
//           password: configService.get<string>('REDIS_PASSWORD'),
//           // pingInterval: 30000, // keep-alive ping, 1 per 30s
//         },
//       }),
//     }),
//   ],
//   exports: [NestRedisModule],
// })
// export class RedisModule {}

// Redis with ioredis package
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { Logger } from 'nestjs-pino';
import { REDIS_CLIENT } from '@/constants/redis.constant';
import Redis from 'ioredis';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const client = new Redis({
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
          lazyConnect: true,
          // enableReadyCheck: true,
          maxRetriesPerRequest: null,
        });

        // client.on('connect', () => {
        //   logger.log('Redis Connected');
        // });

        // client.on('error', (err) => {
        //   logger.error({ err }, 'Redis error');
        // });

        await client.connect();

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}
