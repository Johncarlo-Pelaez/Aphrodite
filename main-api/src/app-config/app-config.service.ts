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

  get domain(): string {
    return this.configService.get('DOMAIN');
  }

  get fileStorage(): string {
    return this.configService.get('FILE_STORAGE') || 'Local';
  }

  get getContractDetails(): string {
    return this.configService.get('END_POINT_GetContracDetails');
  }

  get getDocumentType(): string {
    return this.configService.get('END_POINT_GetDocumentType');
  }

  get uploadToSpringCM(): string {
    return this.configService.get('END_POINT_UploadToSpringCM');
  }

  get handShakeCode(): string {
    return this.configService.get('HANDSHAKE_CODE');
  }

  get organizationId(): string {
    return this.configService.get('ORGANIZATION_ID');
  }
}
