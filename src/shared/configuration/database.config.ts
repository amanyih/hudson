import { registerAs } from '@nestjs/config';
import { Config, DatabaseConfig } from '../../shared/types/config.type';

export default registerAs(
  Config.DATABASE,
  (): DatabaseConfig => ({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  }),
);
