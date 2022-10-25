import { Configuration } from '@azure/msal-browser';
import { LogLevel } from '@azure/msal-browser';

export const scopes = ['User.Read'];

export const buildMsalConfig = (
  clientId: string,
  tenantId: string,
): Configuration => {
  return {
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      redirectUri: '/',
      postLogoutRedirectUri: '/',
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: false,
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPPI) => {
          console.log(message);
        }, logLevel: LogLevel.Info
      }
    }
  };
};
