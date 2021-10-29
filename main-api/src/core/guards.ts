import { Injectable } from '@nestjs/common';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { AppConfigService } from 'src/app-config';
import { AzureUser } from './decorators';

@Injectable()
export class AzureADStrategy extends PassportStrategy(
  BearerStrategy,
  'azure-ad',
) {
  constructor(appConfigService: AppConfigService) {
    super({
      identityMetadata: `https://login.microsoftonline.com/${appConfigService.azureAdTenantId}/v2.0/.well-known/openid-configuration`,
      clientID: appConfigService.azureAdClientId,
    });
  }

  async validate(data: AzureUser) {
    return data;
  }
}

export const AzureADGuard = AuthGuard('azure-ad');
