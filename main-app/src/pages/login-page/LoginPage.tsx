import { ReactElement } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Figure from 'react-bootstrap/Figure';
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
  const { control, handleSubmit } = useForm<SigninForm>({
    resolver: yupResolver(signinFormSchema),
  });

  // Used to sign in a user
  const handleSignin: SubmitHandler<SigninForm> = async (
    params,
  ): Promise<void> => {
    await signIn(params.email);
  };

  // Log In Page
  return (
    <div className={styles.loginContainer}>
      <div className={styles.boxWrappper}>
        <Figure>
          <Figure.Image width={350} height={60} alt="logo" src="/logo.png" />
        </Figure>
        <Form
          className={styles.loginForm}
          onSubmit={handleSubmit(handleSignin)}
        >
          <div className="d-grid gap-2">
            <Controller
              name="email"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { invalid, error } }) => (
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    {...field}
                    disabled={isLoading}
                    placeholder="Enter email"
                    onFocus={(event) => event.target.select()}
                    isInvalid={invalid}
                  />
                  <Form.Control.Feedback type="invalid">
                    {error?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              )}
            />
            <Button variant="warning" type="submit" disabled={isLoading}>
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
            <Alert variant="danger" show={!!error}>
              {error}
            </Alert>
          </div>
        </Form>
      </div>
      <div className={styles.footerWrappper}>
        <p>
          Powered By <img width={100} alt="logo" src="/epds-logo.png"></img>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
