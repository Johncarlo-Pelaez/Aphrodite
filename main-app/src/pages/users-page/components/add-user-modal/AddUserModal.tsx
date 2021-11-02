import { ReactElement } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useCreateUser } from 'hooks';
import * as yup from 'yup';
import { CreateUserApi } from 'apis';
import { Role } from 'models';

const createUserSchema = yup.object().shape({
  email: yup.string().email().required('Email is required.'),
  objectId: yup.string().required('Object ID is required.'),
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
  onClose,
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
    formState: { errors },
  } = useForm<CreateUserApi>({
    resolver: yupResolver(createUserSchema),
  });

  const addUser: SubmitHandler<CreateUserApi> = async (
    params,
  ): Promise<void> => {
    if (!isLoading) {
      await createUserAsync(params);
      closeModal();
    }
  };

  const renderErrorAlert = (): ReactElement | undefined => {
    const show = !!errors.email || isError;
    if (show)
      return (
        <Alert variant="danger" show={isError}>
          {isError &&
            (error?.response?.statusText === 'Conflict'
              ? 'Email already exist'
              : error?.response?.statusText)}
        </Alert>
      );
  };

  const closeModal = (): void => {
    resetForm({ email: '', role: Role.ENCODER, objectId: '' });
    resetUseAddUser();
    onClose();
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={onClose}
      centered
    >
      <Form onSubmit={handleSubmit(addUser)}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>ADD USER</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderErrorAlert()}
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Controller
              name="role"
              control={control}
              defaultValue={Role.ENCODER}
              render={({ field }) => (
                <Form.Select {...field} disabled={isLoading}>
                  <option value={Role.ENCODER}>Encoder</option>
                  <option value={Role.REVIEWER}>Reviewer</option>
                </Form.Select>
              )}
            />
          </Form.Group>
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
          <Form.Group className="mb-3">
            <Form.Label>Object ID</Form.Label>
            <Controller
              name="objectId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Form.Control
                  {...field}
                  disabled={isLoading}
                  placeholder="Enter object ID"
                />
              )}
            />
          </Form.Group>
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
          <Button variant="outline-danger" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
