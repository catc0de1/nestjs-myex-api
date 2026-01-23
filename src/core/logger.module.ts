import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

import type { IncomingMessage } from 'http';

type PinoRequest = IncomingMessage & {
  id?: number | string;
};

@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') === 'development';

        const IGNORED_STATIC_PATHS = new Set([
          '/api/health',
          '/api/health/database',
          '/api/health/redis',
        ]);
        const IGNORED_DYNAMIC_PATHS: RegExp[] = [
          // /api/items/:uuid
          /^\/api\/items\/[^/]+$/,
        ];

        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',
            autoLogging: {
              enabled: true,
              ignorePaths: [],
              ignore: (req) => {
                if (req.method !== 'GET' || !req.url) return false;

                const { pathname } = new URL(req.url, 'http://localhost');
                if (!pathname) return false;

                if (IGNORED_STATIC_PATHS.has(pathname)) return true;

                return IGNORED_DYNAMIC_PATHS.some((pattern) =>
                  pattern.test(pathname),
                );
              },
            },
            customLogLevel: (_req, res, err) => {
              if (res.statusCode >= 500 || err) return 'error';
              // if (res.statusCode === 404) return 'silent';
              return 'info';
            },
            serializers: {
              req(req: PinoRequest) {
                return {
                  id: req.id,
                  method: req.method,
                  url: req.url,
                };
              },
            },
            redact: [
              'req.headers.authorization',
              'req.headers.cookie',
              'req.headers.postman-token',
            ],
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    translateTime: 'SYS:standard',
                    singleLine: true,
                  },
                }
              : {
                  target: 'pino/file',
                  options: {
                    destination: './logs/app.log',
                    mkdir: true,
                  },
                },
          },
        };
      },
    }),
  ],
})
export class LoggerModule {}
