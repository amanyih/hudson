import { registerAs } from '@nestjs/config';
import { AuthConfig } from '../types/config.type';
import { Config } from '../types/config.type';
export default registerAs(
  Config.AUTH,
  (): AuthConfig => ({
    jwt: {
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '90d' },
    },

    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  }),
);
