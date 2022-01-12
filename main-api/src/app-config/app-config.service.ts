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

  get azureAdClientId(): string {
    return this.configService.get('AZURE_AD_CLIENT_ID');
  }

  get azureAdTenantId(): string {
    return this.configService.get('AZURE_AD_TENANT_ID');
  }

  get mailHost(): string {
    return this.configService.get('MAIL_HOST');
  }

  get mailPort(): string {
    return this.configService.get('MAIL_PORT');
  }

  get mailUser(): string {
    return this.configService.get('MAIL_USER');
  }

  get mailPassword(): string {
    return this.configService.get('MAIL_PASSWORD');
  }

  get mailFrom(): string {
    return this.configService.get('MAIL_FROM');
  }

  get baseURL(): string {
    return this.configService.get('BASE_URL');
  }

  get fileStorage(): string {
    return this.configService.get('FILE_STORAGE') || 'Local';
  }

  get s3AccessKeyId(): string {
    return this.configService.get('S3_ACCESS_KEY_ID');
  }

  get s3SecretAccessKey(): string {
    return this.configService.get('S3_SECRET_ACCESS_KEY');
  }

  get s3BucketName(): string {
    return this.configService.get('S3_BUCKET_NAME');
  }
}
