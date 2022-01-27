import { Configuration } from '@azure/msal-browser';

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
  };
};
