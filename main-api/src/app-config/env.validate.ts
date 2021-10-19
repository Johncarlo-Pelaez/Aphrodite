import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
  IsUrl,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
}

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsOptional()
  @IsNumber()
  PORT: number;

  @IsOptional()
  @IsString()
  DB_HOST: string;

  @IsOptional()
  @IsNumber()
  DB_PORT: number;

  @IsOptional()
  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsOptional()
  @IsString()
  REDIS_HOST: string;

  @IsOptional()
  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  FILE_PATH: string;

  @IsString()
  BARCODE_LICENSE: string;

  @IsOptional()
  @IsUrl()
  SALESFORCE_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
