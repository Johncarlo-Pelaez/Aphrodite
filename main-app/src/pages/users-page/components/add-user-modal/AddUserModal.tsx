import { ReactElement, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useAddUser } from 'hooks/user';
import { CreateUserParams } from 'apis/user';
import { Role } from 'core/enums';
import { AddUserModalProps } from './AddUserModal.types';
import { addUserFormSchema } from './AddUserModal.schema';

export const AddUserModal = ({
  isVisible,
  onClose,
}: AddUserModalProps): ReactElement => {
  const [role, setRole] = useState<Role>(Role.ENCODER);
  const {
    isLoading,
    isError,
    error,
    mutateAsync: addUserAsync,
    reset: resetUseAddUser,
  } = useAddUser({ role: role });

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateUserParams>({
    resolver: yupResolver(addUserFormSchema),
  });

  const addUser: SubmitHandler<CreateUserParams> = async (
    params,
  ): Promise<void> => {
    if (!isLoading) {
      await addUserAsync(params);
      closeModal();
    }
  };

  const renderErrorAlert = (): ReactElement | undefined => {
    const show = !!errors.email || isError;
    if (show)
      return (
        <div>
          <Alert variant="danger" show={!!errors.email}>
            {!!errors.email && errors.email?.message}
          </Alert>
          <Alert variant="danger" show={isError}>
            {isError &&
              (error?.response?.statusText === 'Conflict'
                ? 'Email already exist'
                : error?.response?.statusText)}
          </Alert>
        </div>
      );
  };

  const closeModal = (): void => {
    onClose();
    resetForm();
    resetUseAddUser();
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
            <Form.Select
              onChange={(e) => setRole(e.currentTarget.value as Role)}
              disabled={isLoading}
              defaultValue={Role.ENCODER}
            >
              <option value={Role.ENCODER}>Encoder</option>
              <option value={Role.REVIEWER}>Reviewer</option>
            </Form.Select>
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
