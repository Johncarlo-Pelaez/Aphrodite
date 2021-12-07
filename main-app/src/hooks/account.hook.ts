import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import {
  AccountInfo,
  InteractionStatus,
  PopupRequest,
  SilentRequest,
  InteractionRequiredAuthError,
  AuthenticationResult,
} from '@azure/msal-browser';
import { removeApiHeaders, setApiAccessToken, setApiAuthorization } from 'apis';
import { useEmailExists } from './user.hook';
import { scopes } from 'authConfig';
import { useRecoilState } from 'recoil';
import { isAccountTokenLoadedState, isEmailAccountAllowedState } from 'states';
import { queryClient } from 'query-client';

const buildSilentRequest = (account: AccountInfo): SilentRequest => ({
  scopes,
  account,
});

const buildLoginRequest = (email?: string): PopupRequest => ({
  loginHint: email,
  scopes,
});

const onSigninSuccess = (idToken: string, accessToken: string): void => {
  setApiAuthorization(idToken);
  setApiAccessToken(accessToken);
};

const onSignoutSuccess = (): void => {
  removeApiHeaders();
  queryClient.clear();
};

type UseAccountResult = {
  account: AccountInfo | undefined;
};

export const useAccount = (): UseAccountResult => {
  const { accounts } = useMsal();
  let account: AccountInfo | undefined;

  if (accounts.length > 0) {
    account = accounts[0];
  }

  return { account };
};

type UseLoadAccountTokenResult = {
  isLoaded: boolean;
  isAuthenticatedButTokenNotLoaded: boolean;
};

export const useLoadAccountToken = (): UseLoadAccountTokenResult => {
  const [isLoaded, setIsLoaded] = useRecoilState(isAccountTokenLoadedState);
  const { account } = useAccount();
  const { instance } = useMsal();
  const { checkEmailExists } = useEmailExists();
  const { setEmailAllowed } = useEmailAllowed();
  const isAuthenticatedButTokenNotLoaded = !!account && !isLoaded;

  useEffect(() => {
    if (account && !isLoaded) {
      const request = buildSilentRequest(account);
      instance
        .acquireTokenSilent(request)
        .then(async (response) => {
          if (response?.account) {
            const exists = await checkEmailExists(response.account.username);
            if (exists) {
              onSigninSuccess(response.idToken, response.accessToken);
              setIsLoaded(true);
            }
            setEmailAllowed(exists);
          }
        })
        .catch(async (error) => {
          if (error instanceof InteractionRequiredAuthError) {
            let response: AuthenticationResult | undefined = undefined;
            try {
              response = await instance.acquireTokenPopup(request);
            } catch (error) {
              setIsLoaded(false);
              setEmailAllowed(false);
            } finally {
              if (response?.account) {
                const exists = await checkEmailExists(
                  response.account.username,
                );
                if (exists) {
                  onSigninSuccess(response.idToken, response.accessToken);
                  setIsLoaded(true);
                }
                setEmailAllowed(exists);
              }
            }
          } else {
            setIsLoaded(false);
            setEmailAllowed(false);
          }
        });
    }
  }, [
    isLoaded,
    account,
    instance,
    checkEmailExists,
    setEmailAllowed,
    setIsLoaded,
  ]);

  return { isLoaded, isAuthenticatedButTokenNotLoaded };
};

type UseEmailAllowedResult = {
  isAllowed: boolean;
  setEmailAllowed: (allow: boolean) => void;
};

export const useEmailAllowed = (): UseEmailAllowedResult => {
  const [isAllowed, setIsAllowed] = useRecoilState(isEmailAccountAllowedState);

  const setEmailAllowed = (allow: boolean): void => {
    setIsAllowed(allow);
  };

  return { isAllowed, setEmailAllowed };
};

type UseSignInResult = {
  isLoading: boolean;
  error?: string;
  signIn: (email: string) => Promise<void>;
};

export const useSignIn = (): UseSignInResult => {
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
        const { idToken, accessToken } = await instance.loginPopup(
          loginRequest,
        );
        onSigninSuccess(idToken, accessToken);
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

export const useSignOut = (): UseSignOutResult => {
  const { instance, inProgress } = useMsal();
  const isLoading = inProgress === InteractionStatus.Logout;

  const signOut = async (): Promise<void> => {
    await instance.logoutPopup();
    onSignoutSuccess();
  };

  return { isLoading, signOut };
};
