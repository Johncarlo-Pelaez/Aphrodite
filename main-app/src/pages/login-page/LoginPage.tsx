import { ReactElement } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { useSignIn } from 'hooks';
import styles from './LoginPage.module.css';
import * as yup from 'yup';

export interface SigninForm {
  email: string;
}

const signinFormSchema: yup.SchemaOf<SigninForm> = yup.object().shape({
  email: yup.string().email().required('Email is required.'),
});

export const LoginPage = (): ReactElement => {
  const { isLoading, error, signIn } = useSignIn();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninForm>({
    resolver: yupResolver(signinFormSchema),
  });
  const emailError = errors.email?.message || error;

  const handleSignin: SubmitHandler<SigninForm> = async (
    params,
  ): Promise<void> => {
    await signIn(params.email);
  };

  return (
    <div className={styles.loginContainer}>
      <Form className={styles.loginForm} onSubmit={handleSubmit(handleSignin)}>
        <div className="d-grid">
          <Alert variant="danger" show={!!emailError}>
            {emailError}
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
            {isLoading ? ' Logging In...' : 'Log In'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default LoginPage;
