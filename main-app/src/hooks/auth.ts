import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import {
  PopupRequest,
  BrowserAuthError,
  InteractionStatus,
} from '@azure/msal-browser';
import { removeToken, setToken } from 'utils/token';
export { useSignIn, useSignOut };

interface UseSignInParams {
  loginRequest: PopupRequest;
}

interface useSignInResult {
  isLoading: boolean;
  isError: boolean;
  error?: BrowserAuthError;
  signInAsync: () => Promise<void>;
}

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

interface UseSignOutResult {
  isLoading: boolean;
  isError: boolean;
  error?: BrowserAuthError;
  signOutAsync: () => Promise<void>;
}

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
