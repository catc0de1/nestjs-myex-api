import { ConfigService } from '@nestjs/config';

import type { LogLevel } from '@nestjs/common';

export function LoggerConfig(configService: ConfigService): LogLevel[] {
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  return isProd
    ? ['error', 'warn', 'log']
    : ['error', 'warn', 'log', 'debug', 'verbose'];
}
