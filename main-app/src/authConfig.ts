import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '13bd7dbf-1e35-4dc2-b5f7-e8c26d6f8a3d',
    authority:
      'https://login.microsoftonline.com/f5fd42b7-4db5-4b3e-aaa6-f2e5542f7357',
    redirectUri: '/',
    postLogoutRedirectUri: '/',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const scopes = ['User.Read'];
