import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from '@azure/msal-browser';
import { getIsUserEmailExist } from 'apis/user';
import { removeToken, setToken } from 'utils/token';
import { setAuthorization } from 'apis/request';

export { useSignIn, useSignOut, useGetCurrentSignInUserName };
export type SignInParams = {
  email: string;
};

type useSignInResult = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  signInAsync: (signInParams: SignInParams) => Promise<void>;
};

const useSignIn = (): useSignInResult => {
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);
  const { instance, inProgress } = useMsal();
  const isLoading = inProgress === InteractionStatus.Login;

  const signInAsync = async ({ email }: SignInParams): Promise<void> => {
    try {
      if (!(await getIsUserEmailExist(`email=${email}`))) {
        alert('User does not exist.');
        return;
      }
      const loginRequest = {
        loginHint: email,
        scopes: ['User.Read'],
      };
      setIsError(false);
      setError(undefined);
      const res = await instance.loginPopup(loginRequest);
      setToken(res.accessToken);
      setAuthorization(res.idToken);
    } catch (err) {
      setIsError(true);
      setError(err);
    }
  };

  return { isLoading, isError, error, signInAsync };
};

type UseSignOutResult = {
  isLoading: boolean;
  isError: boolean;
  error: any;
  signOutAsync: () => Promise<void>;
};

const useSignOut = (): UseSignOutResult => {
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<any>(undefined);
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
      setError(err);
    }
  };

  return { isLoading, isError, error, signOutAsync };
};

const useGetCurrentSignInUserName = (): string | undefined => {
  const { accounts } = useMsal();
  return accounts[0]?.username;
};
