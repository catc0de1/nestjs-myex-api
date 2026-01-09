import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '@/app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      // contentSecurityPolicy: {
      //   directives: {
      //     defaultSrc: ["'self'"],
      //     frameSrc: ["'self'", 'blob:'],
      //   },
      // },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port);
}
bootstrap();
