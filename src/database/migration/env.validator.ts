import * as Joi from 'joi';

const schema = Joi.object({
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});

const { error } = schema.validate(process.env, {
  allowUnknown: true,
});

if (error) {
  throw new Error(`Invalid env: ${error.message}`);
}
