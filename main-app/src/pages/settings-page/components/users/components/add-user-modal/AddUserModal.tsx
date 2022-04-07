import { ReactElement, useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { checkIfConflict } from 'utils';
import { useCreateUser } from 'hooks';
import * as yup from 'yup';
import { CreateUserApi } from 'apis';
import { Role } from 'core/enum';
import {
  RoleField,
  EmailField,
  LastNameField,
  FirstNameField,
} from './components';

interface CreateUserForm extends CreateUserApi, FieldValues {}

const createUserSchema = yup.object().shape({
  email: yup.string().email().required('Email is required.'),
  firstName: yup.string().required('First name is required.'),
  lastName: yup.string().required('Last name is required.'),
  role: yup
    .mixed<Role>()
    .oneOf(Object.values(Role))
    .required('Role is required.'),
});

export interface AddUserModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AddUserModal = ({
  isVisible,
  onClose: triggerClose,
}: AddUserModalProps): ReactElement => {
  const {
    isLoading,
    isError,
    error,
    mutateAsync: createUserAsync,
    reset: resetUseAddUser,
  } = useCreateUser();

  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<CreateUserForm>({
    resolver: yupResolver(createUserSchema),
  });

  const addUser: SubmitHandler<CreateUserApi> = async (
    params,
  ): Promise<void> => {
    if (!isLoading) {
      await createUserAsync(params);
      alert('New user has successfuly added.');
      handleClose();
    }
  };

  const handleClose = (): void => {
    resetForm({
      email: '',
      role: Role.ENCODER,
      objectId: '',
      firstName: '',
      lastName: '',
    });
    triggerClose();
  };

  useEffect(() => {
    return function componentCleanup() {
      resetUseAddUser();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={triggerClose}
      centered
    >
      <Form onSubmit={handleSubmit(addUser)}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>ADD USER</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger" show={isError}>
            {!!error && checkIfConflict(error)
              ? 'Email already exist'
              : 'Create user failed.'}
          </Alert>
          <fieldset disabled={isLoading}>
            <RoleField control={control} />
            <FirstNameField control={control} />
            <LastNameField control={control} />
            <EmailField control={control} />
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={isLoading}>
            <Spinner
              hidden={!isLoading}
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            {isLoading ? ' Saving...' : 'Save'}
          </Button>
          <Button variant="outline-danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
