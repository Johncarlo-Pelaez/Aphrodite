import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from './env.validate';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get nodeEnv(): Environment {
    return this.configService.get('NODE_ENV') || Environment.Development;
  }

  get port(): number {
    return this.configService.get('PORT') || 3000;
  }

  get dbHost(): string {
    return this.configService.get('DB_HOST') || 'localhost';
  }

  get dbPort(): number {
    return this.configService.get('DB_PORT') || 1433;
  }

  get dbUser(): string {
    return this.configService.get('DB_USER') || 'sa';
  }

  get dbPassword(): string {
    return this.configService.get('DB_PASSWORD');
  }

  get dbName(): string {
    return this.configService.get('DB_NAME');
  }

  get redisHost(): string {
    return this.configService.get('REDIS_HOST') || 'localhost';
  }

  get redisPort(): number {
    return this.configService.get('REDIS_PORT') || 6379;
  }

  get filePath(): string {
    return this.configService.get('FILE_PATH');
  }

  get barcodeLicense(): string {
    return this.configService.get('BARCODE_LICENSE');
  }

  get salesForceURl(): string {
    return (
      this.configService.get('SALESFORCE_URL') || 'http://10.202.17.246/ci'
    );
  }
}
