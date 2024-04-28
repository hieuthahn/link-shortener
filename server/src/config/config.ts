import { ConnectOptions } from 'mongoose';
import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

const envVarsSchema = z.object({
  NODE_ENV: z.enum(['production', 'development', 'test']),
  PORT: z.coerce.number().default(3000),
  MONGODB_URL: z.string({
    description: 'Mongo DB url',
  }),
  JWT_SECRET: z.string({
    description: 'JWT secret key',
  }),
  JWT_ACCESS_EXPIRATION_MINUTES: z.coerce.number({
    description: 'minutes after which access tokens expire',
  }),
  JWT_REFRESH_EXPIRATION_DAYS: z.coerce
    .number({
      description: 'minutes after which access tokens expire',
    })
    .default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: z.coerce
    .number({
      description: 'minutes after which reset password token expires',
    })
    .default(10),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: z.coerce
    .number({
      description: 'minutes after which verify email token expires',
    })
    .default(10),
  SMTP_HOST: z.string({
    description: 'server that will send the emails',
  }),
  SMTP_PORT: z.coerce.number({
    description: 'port to connect to the email server',
  }),
  SMTP_USERNAME: z.string({
    description: 'username for email server',
  }),
  SMTP_PASSWORD: z.string({
    description: 'password for email server',
  }),
  EMAIL_FROM: z.string({
    description: 'the from field in the emails sent by the app',
  }),
  RESET_PASSWORD_URL: z.string({
    description: 'url that will be used to reset password',
  }),
  VERIFY_EMAIL_URL: z.string({
    description: 'url that will be used to verify email',
  }),
  DEFAULT_LINK_SHORTEN_EXPIRATION_IN_DAYS: z.coerce.number({
    description: 'default link expiration in days',
  }),
  SHORT_CODE_LENGTH: z.coerce.number({
    description: 'length of short code',
  }),
});

const envVars = envVarsSchema.parse(process.env);

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {} as ConnectOptions,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  auth: {
    resetPasswordUrl: envVars.RESET_PASSWORD_URL,
    verifyEmailUrl: envVars.VERIFY_EMAIL_URL,
  },
  link: {
    defaultExpirationDays: envVars.DEFAULT_LINK_SHORTEN_EXPIRATION_IN_DAYS,
    shortCodeLength: envVars.SHORT_CODE_LENGTH,
  },
  ipGeoApiKey: {
    ipify: process.env.ipify_API_KEY,
    ipgeolocation: process.env.ipgeolocation_API_KEY,
    ipinfo: process.env.ipinfo_API_KEY,
    ipgeolocation_abstractapi: process.env.ipgeolocation_abstractapi_API_KEY,
    ip2location: process.env.ip2location_API_KEY,
    geoapify: process.env.geoapify_API_KEY,
    findip: process.env.findip_API_Key,
    api_bdc: process.env.api_bdc_API_KEY,
  },
};

export default config;
