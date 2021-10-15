import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { BrowserAuthError, InteractionStatus } from '@azure/msal-browser';
import { removeToken, setToken } from 'utils/token';
import {
  UseSignInParams,
  useSignInResult,
  UseSignOutResult,
} from './auth.types';

export { useSignIn, useSignOut, useGetCurrentSignInUserName };

const useSignIn = (params: UseSignInParams): useSignInResult => {
  const { loginRequest } = params;
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<BrowserAuthError | undefined>(undefined);
  const { instance, inProgress } = useMsal();
  const isLoading = inProgress === InteractionStatus.Login;

  const signInAsync = async (): Promise<void> => {
    try {
      const res = await instance.loginPopup(loginRequest);
      setIsError(false);
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
      await instance.logoutPopup();
      setIsError(false);
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
