import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './app-config';

@Controller('/app')
export class AppController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('/msal')
  getMsal(): { azureAdClientId: string; azureAdTenantId: string } {
    return {
      azureAdClientId: this.appConfigService.azureAdClientId,
      azureAdTenantId: this.appConfigService.azureAdTenantId,
    };
  }
}
