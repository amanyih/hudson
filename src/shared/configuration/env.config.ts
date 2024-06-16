import { registerAs } from '@nestjs/config';
import { Config, EnvConfig } from '../types/config.type';

export default registerAs(
  Config.ENV,
  (): EnvConfig => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
  }),
);
