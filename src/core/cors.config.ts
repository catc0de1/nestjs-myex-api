import { ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CorsConfig = (configService: ConfigService): CorsOptions => {
  return {
    origin: (origin, callback) => {
      const isProd =
        configService.getOrThrow<string>('NODE_ENV') === 'production';

      if (!isProd) {
        callback(null, true);
        return;
      }

      const allowedOrigins: string[] = configService
        .getOrThrow<string>('CORS_URL')
        .split(',')
        .map((url) => url.trim());

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new ForbiddenException('Not allowed by CORS'));
      }
    },

    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  };
};
