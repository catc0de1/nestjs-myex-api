import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

import { HelmetConfig } from './core/helmet.config';
import { PipeConfig } from './core/pipe.config';
import { LoggerConfig } from './core/logger.config';
import { CorsConfig } from './core/cors.config';

// import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(HelmetConfig());
  app.useGlobalPipes(PipeConfig());
  app.useLogger(LoggerConfig(configService));
  app.enableCors(CorsConfig(configService));
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
bootstrap();
