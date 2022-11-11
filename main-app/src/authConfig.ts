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
          if (containsPPI) {	
            return;	
        }
          switch (level) {	
            case LogLevel.Error:	
              console.error(message);	
              return;	
            case LogLevel.Info:	
              console.info(message);	
                return;	
            case LogLevel.Verbose:	
              console.debug(message);	
              return;	
            case LogLevel.Warning:	
              console.warn(message);	
              return;	
            default:
              return;
          }
        },
      },
      windowHashTimeout: 0,
      iframeHashTimeout: 0,
      loadFrameTimeout: 0,
      tokenRenewalOffsetSeconds: 0,
      redirectNavigationTimeout: 0,
    }
  };
};
