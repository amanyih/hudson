export type DatabaseConfig = {
  datasources: {
    db: {
      url: string;
    };
  };
};

export type AuthConfig = {
  jwt: {
    secret: string;
    signOptions: { expiresIn: string };
  };
  google: {
    clientId: string;
    clientSecret: string;
  };
};

export type EnvConfig = {
  port: number;
  environment: string;
};

export enum Config {
  DATABASE = 'database',
  AUTH = 'auth',
  ENV = 'env',
}

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}
