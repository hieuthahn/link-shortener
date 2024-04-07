import Zod from 'zod';

const envVarsSchema = Zod.object({
  NODE_ENV: Zod.enum(['production', 'development', 'test']),
  PORT: Zod.number().default(3000),
  MONGODB_URL: Zod.string({
    description: 'Mongo DB url',
  }),
  JWT_SECRET: Zod.string({
    description: 'JWT secret key',
  }),
  JWT_ACCESS_EXPIRATION_MINUTES: Zod.number({
    description: 'minutes after which access tokens expire',
  }).default(30),
  JWT_REFRESH_EXPIRATION_DAYS: Zod.number({
    description: 'minutes after which access tokens expire',
  }).default(30),
  JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Zod.number({
    description: 'minutes after which reset password token expires',
  }).default(10),
  JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Zod.number({
    description: 'minutes after which verify email token expires',
  }).default(10),
  SMTP_HOST: Zod.string({
    description: 'server that will send the emails',
  }),
  SMTP_PORT: Zod.number({
    description: 'port to connect to the email server',
  }),
  SMTP_USERNAME: Zod.string({
    description: 'username for email server',
  }),
  SMTP_PASSWORD: Zod.string({
    description: 'password for email server',
  }),
  EMAIL_FROM: Zod.string({
    description: 'the from field in the emails sent by the app',
  }),
  RESET_PASSWORD_URL: Zod.string({
    description: 'url that will be used to reset password',
  }),
  VERIFY_EMAIL_URL: Zod.string({
    description: 'url that will be used to verify email',
  }),
});

const envVars = envVarsSchema.parse(process.env);

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
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
};

export default config;
