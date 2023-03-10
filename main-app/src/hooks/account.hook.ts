import { useEffect, useState } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
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
      const requestSilent = buildSilentRequest(account);
      const loginRequest = buildLoginRequest(account.username);
      instance
        .acquireTokenSilent(requestSilent)
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
              response = await instance.acquireTokenPopup(loginRequest);
            } catch (error) {
              alert(error);
            }

            if (response?.account) {
              const exists = await checkEmailExists(response.account.username);
              if (exists) {
                onSigninSuccess(response.idToken, response.accessToken);
                setIsLoaded(true);
              }
              setEmailAllowed(exists);
            }
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

export const useAccountToActivate = (): boolean => {
  const {instance} = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const { account } = useAccount();
  const isAuthenticatedUser = !!account || !isAuthenticated;

  

  useEffect(() => {
    if(account && !isAuthenticated)
    {
      const requestSilent = buildSilentRequest(account);

      instance.ssoSilent(buildSilentRequest(account))
        .then((response) => 
        { 
          instance.setActiveAccount(response.account);
          onSigninSuccess(response.idToken, response.accessToken);
        })
        .catch(async (error) => { 
          if(error instanceof InteractionRequiredAuthError){
            let response: AuthenticationResult | undefined = undefined;
            try
            {
              response = await instance.acquireTokenSilent(requestSilent)
            }
            catch(error)
            { alert(error) }

            if (response?.account)
            {
              onSigninSuccess(response.idToken, response.accessToken);
              instance.acquireTokenRedirect({scopes: scopes})
            }
            

          }
        })
      }
  }, [instance, isAuthenticated, account])

  return isAuthenticatedUser;
}

export const GetToken = async () => {
  const { instance, inProgress } = useMsal();
  const accounts = instance.getAllAccounts();
  const isAuthenticated = useIsAuthenticated();

  if(accounts.length > 0 && isAuthenticated)
  {
    const silentRequest = {
      scopes,
      account: instance.getActiveAccount() || accounts[0] 
    };

    const redirectRequest = {scopes};

    try {
      const response = await instance.acquireTokenSilent(silentRequest);
      onSigninSuccess(response.idToken, response.accessToken);
    } catch (error) {
      if (error instanceof (InteractionRequiredAuthError)){
        if (inProgress === InteractionStatus.None)
        {
          await instance.loginRedirect(redirectRequest);
        }
      }
    }
  }
}

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
