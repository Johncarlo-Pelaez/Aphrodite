import { atom } from 'recoil';

export const isAccountTokenLoadedState = atom<boolean>({
  key: 'isAccountTokenLoadedState',
  default: false,
});
