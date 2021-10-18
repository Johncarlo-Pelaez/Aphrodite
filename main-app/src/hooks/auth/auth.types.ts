import { BrowserAuthError } from '@azure/msal-browser';

export interface useSignInResult {
  isLoading: boolean;
  isError: boolean;
  error?: BrowserAuthError;
  signInAsync: (signInParams: SignInParams) => Promise<void>;
}

export interface UseSignOutResult {
  isLoading: boolean;
  isError: boolean;
  error?: BrowserAuthError;
  signOutAsync: () => Promise<void>;
}

export type SignInParams = {
  email: string;
};
