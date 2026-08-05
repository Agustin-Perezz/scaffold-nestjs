import * as Sentry from '@sentry/nestjs';

import { ENV } from './infrastructure/config/env.constants';

const isProduction = process.env.NODE_ENV === ENV.PRODUCTION;
const DEFAULT_TRACES_RATE = 0.1;

Sentry.init({
  dsn: isProduction ? process.env.SENTRY_DSN : undefined,
  enabled: isProduction,
  environment: process.env.NODE_ENV ?? ENV.DEVELOPMENT,
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? DEFAULT_TRACES_RATE),
});
