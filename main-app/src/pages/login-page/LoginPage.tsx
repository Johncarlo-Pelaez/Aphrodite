import { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSignIn } from 'hooks/auth';
import { loginRequest } from 'authConfig';
import styles from './LoginPage.module.css';

export const LoginPage = (): ReactElement => {
  const { isLoading, error, signInAsync } = useSignIn({ loginRequest });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className={styles.loginContainer}>
      <Form className={styles.loginForm}>
        <div className="d-grid">
          <Button variant="primary" onClick={signInAsync}>
            Log In
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
