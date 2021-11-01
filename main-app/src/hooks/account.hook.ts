import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import {
  AccountInfo,
  InteractionStatus,
  PopupRequest,
  SilentRequest,
} from '@azure/msal-browser';
import { removeApiAuthorization, setApiAuthorization } from 'apis';
import { useEmailExists } from './user.hook';
import { scopes } from 'authConfig';
import { useRecoilState } from 'recoil';
import { isAccountTokenLoadedState } from 'states';
import { queryClient } from 'query-client';

export { useAccount, useLoadAccountToken, useSignIn, useSignOut };

const buildSilentRequest = (account: AccountInfo): SilentRequest => ({
  scopes,
  account,
});

const buildLoginRequest = (email?: string): PopupRequest => ({
  loginHint: email,
  scopes,
});

const onSigninSuccess = (idToken: string): void => {
  setApiAuthorization(idToken);
};

const onSignoutSuccess = (): void => {
  removeApiAuthorization();
  queryClient.clear();
};

type UseAccountResult = {
  account: AccountInfo | undefined;
};

const useAccount = (): UseAccountResult => {
  const { accounts } = useMsal();
  let account: AccountInfo | undefined;

  if (accounts.length > 0) {
    account = accounts[0];
  }

  return { account };
};

type UseLoadAccountTokenResult = {
  isAuthenticatedButTokenNotLoaded: boolean;
};

const useLoadAccountToken = (): UseLoadAccountTokenResult => {
  const [isLoaded, setIsLoaded] = useRecoilState(isAccountTokenLoadedState);
  const { account } = useAccount();
  const { instance } = useMsal();
  const isAuthenticatedButTokenNotLoaded = !!account && !isLoaded;

  useEffect(() => {
    if (account && !isLoaded) {
      const request = buildSilentRequest(account);
      instance.acquireTokenSilent(request).then((response) => {
        onSigninSuccess(response.idToken);
        setIsLoaded(true);
      });
    }
  }, [isLoaded, account, instance, setIsLoaded]);

  return { isAuthenticatedButTokenNotLoaded };
};

type UseSignInResult = {
  isLoading: boolean;
  error?: string;
  signIn: (email: string) => Promise<void>;
};

const useSignIn = (): UseSignInResult => {
  const [error, setError] = useState<string>();
  const { isLoading: isEmailChecking, checkEmailExists } = useEmailExists();
  const { inProgress, instance } = useMsal();
  const isSigningIn = inProgress === InteractionStatus.Login;
  const isLoading = isEmailChecking || isSigningIn;

  const signIn = async (email: string): Promise<void> => {
    setError(undefined);

    try {
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        setError('User does not exists.');
      } else {
        const loginRequest = buildLoginRequest(email);
        const { idToken } = await instance.loginPopup(loginRequest);
        onSigninSuccess(idToken);
      }
    } catch (err) {
      setError('Could not sign in.');
    }
  };

  return { isLoading, error, signIn };
};

type UseSignOutResult = {
  isLoading: boolean;
  signOut: () => Promise<void>;
};

const useSignOut = (): UseSignOutResult => {
  const { instance, inProgress } = useMsal();
  const isLoading = inProgress === InteractionStatus.Logout;

  const signOut = async (): Promise<void> => {
    await instance.logoutPopup();
    onSignoutSuccess();
  };

  return { isLoading, signOut };
};
