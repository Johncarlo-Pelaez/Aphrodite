import { PopupRequest, BrowserAuthError } from '@azure/msal-browser';

export interface UseSignInParams {
  loginRequest: PopupRequest;
}

export interface useSignInResult {
  isLoading: boolean;
  isError: boolean;
  error?: BrowserAuthError;
  signInAsync: () => Promise<void>;
}

export interface UseSignOutResult {
  isLoading: boolean;
  isError: boolean;
  error?: BrowserAuthError;
  signOutAsync: () => Promise<void>;
}
