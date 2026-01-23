import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { SeedModule } from './seed.module';
import { DevSeeder } from './dev.seed';
import { ProdSeeder } from './prod.seed';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);

  const config = app.get(ConfigService);
  const ENV = config.get<string>('NODE_ENV');

  if (ENV === 'production') {
    await app.get(ProdSeeder).run();
  } else {
    await app.get(DevSeeder).run();
  }

  await app.close();
}
bootstrap().catch((err) => {
  console.error('Bootstrap failed', err);
  process.exit(1);
});
