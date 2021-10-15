import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { loginRequest } from 'authConfig';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
  const { instance, accounts } = useMsal();

  return (
    <div className={styles.loginContainer}>
      <Form className={styles.loginForm}>
        <div className="d-grid">
          <AuthenticatedTemplate>
            <h5>{accounts[0]?.name}</h5>
            <h5>{accounts[0]?.username}</h5>
            <Button variant="danger" onClick={(e) => instance.logoutPopup()}>
              Log Out
            </Button>
          </AuthenticatedTemplate>
          <UnauthenticatedTemplate>
            <Button
              variant="primary"
              onClick={(e) => instance.loginPopup(loginRequest)}
            >
              Log In
            </Button>
          </UnauthenticatedTemplate>
        </div>
      </Form>
    </div>
  );
};
