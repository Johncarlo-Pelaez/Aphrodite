import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getCustomRepository } from 'typeorm';
import { PassportStrategy, AuthGuard } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { AppConfigService } from 'src/app-config';
import { ROLES_KEY } from 'src/core/constants';
import { Role } from 'src/entities';
import { AzureUser } from './decorators';
import { UserRepository } from 'src/repositories';

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

  validate(data: AzureUser) {
    return data;
  }
}

export const AzureADGuard = AuthGuard('azure-ad');

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || !roles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const username = request?.user?.preferred_username;
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.getAuthUserByEmail(username);

    if (!user) throw new UnauthorizedException();

    return roles?.some((role) => role === user.role);
  }
}
