import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { BrowserAuthError, InteractionStatus } from '@azure/msal-browser';
import { removeToken, setToken } from 'utils/token';

export { useSignIn, useSignOut, useGetCurrentSignInUserName };

export type SignInParams = {
  email: string;
};

type useSignInResult = {
  isLoading: boolean;
  isError: boolean;
  error?: BrowserAuthError;
  signInAsync: (signInParams: SignInParams) => Promise<void>;
};

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

type UseSignOutResult = {
  isLoading: boolean;
  isError: boolean;
  error?: BrowserAuthError;
  signOutAsync: () => Promise<void>;
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
