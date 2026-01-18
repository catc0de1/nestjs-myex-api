import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';

import { HelmetConfig } from './core/helmet.config';
import { PipeConfig } from './core/pipe.config';
import { CorsConfig } from './core/cors.config';

// import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  app.use(HelmetConfig());
  app.useGlobalPipes(PipeConfig());
  app.useLogger(app.get(Logger));
  app.enableCors(CorsConfig(configService));
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
bootstrap();
