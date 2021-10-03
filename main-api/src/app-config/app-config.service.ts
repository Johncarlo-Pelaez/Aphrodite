import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Environment } from './env.validate';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

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
}
