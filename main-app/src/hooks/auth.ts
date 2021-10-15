import { useEffect, useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { PopupRequest, BrowserAuthError } from '@azure/msal-browser';
import { removeToken, setToken } from 'utils/token';
export {
  useSignIn,
  //useSignOut
};

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
  const { instance, accounts, inProgress } = useMsal();
  const isLoading = inProgress === 'login';

  const signInAsync = async (): Promise<void> => {
    try {
      await instance.loginPopup(loginRequest);
    } catch (err) {
      setIsError(true);
      setError(err as BrowserAuthError);
    }
  };

  useEffect(() => {
    if (inProgress === 'none' && accounts.length > 0) {
      instance
        .acquireTokenSilent({
          account: accounts[0],
          scopes: ['User.Read'],
        })
        .then((response) => {
          if (response.accessToken) {
            setToken(response.accessToken);
          }
        });
    }
  }, [inProgress, accounts, instance]);

  return { isLoading, isError, error, signInAsync };
};

// const useSignOut = (): UseMutationResult<void, ApiError, void> => {
//   return useMutation<void, ApiError>(deleteAuth, {
//     onSuccess: () => {
//       removeAuthBearer();
//       removeBusinessUnitIdInHeader();
//       removeToken();
//     },
//   });
// };
