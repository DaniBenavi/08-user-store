import 'dotenv/config';
import { get } from 'env-var';
import { mongo } from 'mongoose';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  DB_NAME: get('MONGO_DB_NAME').required().asString(),
  MONGO_URL: get('MONGO_URL').required().asString(),
  JWT_SEED: get('JWT_SEED').required().asString(),

  MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
  MAILER_EMAIL: get('MAILER_SERVICE').required().asString(),
  MAILER_SECRET_KEY: get('MAILER_SERVICE').required().asString(),
  WEB_SERVICE_URL: get('WEB_SERVICE_URL').required().asString(),
};
