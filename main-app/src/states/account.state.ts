import { atom } from 'recoil';

export const isAccountTokenLoadedState = atom<boolean>({
  key: 'isAccountTokenLoadedState',
  default: false,
});

export const isEmailAccountAllowedState = atom<boolean>({
  key: 'isEmailAccountAllowedState',
  default: false,
});
