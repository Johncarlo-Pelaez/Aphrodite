import cookie from 'js-cookie';
import { APP_TOKEN_NAME } from 'core/constants';

export { getToken, checkIfTokenExist, setToken, removeToken };

const getToken = (): string => {
  return cookie.getJSON(APP_TOKEN_NAME);
};

const checkIfTokenExist = (): boolean => !!getToken();

const setToken = (token: string): void => {
  cookie.set(APP_TOKEN_NAME, token);
};

const removeToken = (): void => {
  cookie.remove(APP_TOKEN_NAME);
};
