import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { HelmetConfig } from './core/helmet.config';
import { PipeConfig } from './core/pipe.config';
import { AppModule } from './app.module';

// import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(HelmetConfig);
  app.useGlobalPipes(PipeConfig());

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
bootstrap();
