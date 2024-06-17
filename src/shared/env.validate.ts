import { Transform, plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
  validateSync,
} from 'class-validator';
import { Environment } from './types/config.type';

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  @IsNumber()
  @Min(3000)
  @Max(65535)
  PORT = 3000;

  @IsNotEmpty()
  DATABASE_URL: string;

  @IsNotEmpty()
  JWT_SECRET: string;

  @IsNotEmpty()
  JWT_EXPIRES_IN: string;

  @IsNotEmpty()
  GOOGLE_CLIENT_ID: string;

  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error('Config validation error: ');
    console.error(errors.toString());
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
