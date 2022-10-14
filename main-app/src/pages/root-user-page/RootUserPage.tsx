import { ReactElement, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Figure from 'react-bootstrap/Figure';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { FullHeightSpinner } from 'core/ui';
import { CreateRootUserApi } from 'apis';
import { useCreateRootUser, useRootUserExists } from 'hooks';
import { checkIfConflict } from 'utils';
import styles from './RootUserPage.module.css';
import {
  EmailField,
  LastNameField,
  FirstNameField,
} from './components';

const createRootUserSchema = yup.object().shape({
  email: yup.string().email().required('Email is required.'),
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
});

export const RootUserPage = (): ReactElement => {
  const history = useHistory();
  const { isLoading, isError, data: isRootExist } = useRootUserExists();
  const {
    isLoading: createLoading,
    isError: hasCreateError,
    error: createError,
    mutateAsync: createRootUserAsync,
    reset,
  } = useCreateRootUser();

  const { control, handleSubmit } = useForm<CreateRootUserApi>({
    resolver: yupResolver(createRootUserSchema),
  });

  // Create Root User
  const createRootUser: SubmitHandler<CreateRootUserApi> = async (
    params,
  ): Promise<void> => {
    if (!isLoading) {
      await createRootUserAsync(params);
      alert('Root user has successfuly created.');
      redirectToSigninPage();
    }
  };

  const redirectToSigninPage = (): void => {
    history.push('/auth');
  };

  useEffect(() => {
    return function componentCleanup() {
      reset();
    };
  }, [reset]);

  if (isLoading) return <FullHeightSpinner />;
  if (isError || isRootExist) return <Redirect to="/not-found" />;

  // Root User Page
  return (
    <div className={styles.FormContainer}>
      <div>
        <Figure>
          <Figure.Image width={350} height={60} alt="logo" src="/logo.png" />
        </Figure>
        <h5 className="text-center">Create Root User</h5>
        <Form
          className={styles.CreateRootUserForm}
          onSubmit={handleSubmit(createRootUser)}
        >
          <div className="d-grid gap-2">
            <fieldset disabled={createLoading}>
              <FirstNameField control={control} />
              <LastNameField control={control} />
              <EmailField control={control} />
            </fieldset>
            <Button variant="warning" type="submit" disabled={createLoading}>
              <Spinner
                hidden={!createLoading}
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              {createLoading ? ' Creating...' : 'Create'}
            </Button>
            <Alert variant="danger" show={hasCreateError}>
              {!!createError && checkIfConflict(createError)
                ? 'Email already exist'
                : 'Failed to create root user.'}
            </Alert>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RootUserPage;
