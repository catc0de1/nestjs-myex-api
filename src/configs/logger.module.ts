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
        const IGNORED_PATHS = new Set(['/api/health/', '/api/health/db']);

        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',
            autoLogging: {
              ignore: (req) =>
                req.method === 'GET' && IGNORED_PATHS.has(req.url ?? ''),
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
                    destination: '/var/log/smi/app.log',
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
