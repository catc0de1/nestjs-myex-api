import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
// import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { HelmetConfig } from './configs/helmet.config';
import { PipeConfig } from './configs/pipe.config';
import { CorsConfig } from './configs/cors.config';
// import { doubleCsrfProtection } from './modules/csrf/common/csrf-csrf';

// import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);

  app.use(HelmetConfig());
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(PipeConfig());
  app.enableCors(CorsConfig(configService));
  // app.use(cookieParser());
  // app.use(doubleCsrfProtection);
  app.setGlobalPrefix('api');

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});
