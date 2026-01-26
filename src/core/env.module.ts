import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().optional(),
        NODE_ENV: Joi.string().valid('development', 'production').required(),

        PEPPER_SECRET: Joi.string().required(),

        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
        REDIS_PASSWORD: Joi.string().required(),

        SESSION_SECRET: Joi.string().required(),
        SESSION_TTL: Joi.number().required(),

        JWT_SECRET: Joi.string().required(),

        CORS_URL: Joi.string().optional(),

        CSRF_SECRET: Joi.string().required(),

        ADMIN_EMAIL_SEED: Joi.string().email().required(),
        ADMIN_PASSWORD_SEED: Joi.string().required(),
      }),
    }),
  ],
})
export class EnvModule {}
