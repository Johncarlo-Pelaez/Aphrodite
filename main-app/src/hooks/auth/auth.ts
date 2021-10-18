import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { BrowserAuthError, InteractionStatus } from '@azure/msal-browser';
import { removeToken, setToken } from 'utils/token';
import { useSignInResult, UseSignOutResult, SignInParams } from './auth.types';

export { useSignIn, useSignOut, useGetCurrentSignInUserName };

const useSignIn = (): useSignInResult => {
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<BrowserAuthError | undefined>(undefined);
  const { instance, inProgress } = useMsal();
  const isLoading = inProgress === InteractionStatus.Login;

  const signInAsync = async (signInParams: SignInParams): Promise<void> => {
    try {
      const loginRequest = {
        loginHint: signInParams.email,
        scopes: ['User.Read'],
      };
      setIsError(false);
      setError(undefined);
      const res = await instance.loginPopup(loginRequest);
      setToken(res.accessToken);
    } catch (err) {
      setIsError(true);
      setError(err as BrowserAuthError);
    }
  };

  return { isLoading, isError, error, signInAsync };
};

const useSignOut = (): UseSignOutResult => {
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<BrowserAuthError | undefined>(undefined);
  const { instance, inProgress } = useMsal();
  const isLoading = inProgress === InteractionStatus.Logout;

  const signOutAsync = async (): Promise<void> => {
    try {
      setIsError(false);
      setError(undefined);
      await instance.logoutPopup();
      removeToken();
    } catch (err) {
      setIsError(true);
      setError(err as BrowserAuthError);
    }
  };

  return { isLoading, isError, error, signOutAsync };
};

const useGetCurrentSignInUserName = (): string | undefined => {
  const { accounts } = useMsal();
  return accounts[0]?.username;
};
