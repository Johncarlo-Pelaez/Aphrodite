import { ReactElement } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { useSignIn } from 'hooks/auth';
import styles from './LoginPage.module.css';
import { SignInParams } from 'hooks/auth';
import { signinFormSchema } from './loginPage.schema';

export const LoginPage = (): ReactElement => {
  const { isLoading, signInAsync } = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInParams>({
    resolver: yupResolver(signinFormSchema),
  });

  const signIn: SubmitHandler<SignInParams> = async (params): Promise<void> => {
    if (!isLoading) await signInAsync(params);
  };

  return (
    <div className={styles.loginContainer}>
      <Form className={styles.loginForm} onSubmit={handleSubmit(signIn)}>
        <div className="d-grid">
          <Alert variant="danger" show={!!errors.email}>
            {errors.email?.message}
          </Alert>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Form.Control
                  {...field}
                  disabled={isLoading}
                  placeholder="Enter email"
                />
              )}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            <Spinner
              hidden={!isLoading}
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            {isLoading ? ' Loging In...' : 'Log In'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
