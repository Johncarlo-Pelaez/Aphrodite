import { ReactElement, useEffect } from 'react';
import { UpdateUserApi, UpdateUserIdentityApi } from 'apis';
import { Role } from 'models';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUpdateUser } from 'hooks';
import { updateUserSchema, initialFormState } from './UpdateUser.schema';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { UpdateUserModalProps } from './UpdateUserModal.props';

export const UpdateUserModal = ({
  user,
  isVisible,
  onClose,
}: UpdateUserModalProps): ReactElement => {
  const hasUserSelected = !!user;
  const {
    isLoading,
    isError,
    error,
    mutateAsync: updateUserAsync,
    reset: resetUseUpdateUser,
  } = useUpdateUser();

  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue: set,
    formState: { errors },
  } = useForm<UpdateUserApi>({
    resolver: yupResolver(updateUserSchema),
    defaultValues: initialFormState,
  });

  const updateUser: SubmitHandler<UpdateUserIdentityApi> = async (
    params,
  ): Promise<void> => {
    if (hasUserSelected) {
      const userParam = { ...params, id: user?.id };
      if (!isLoading) {
        await updateUserAsync(userParam);
        closeModal();
      }
    }
  };

  const renderErrorAlert = (): ReactElement => {
    let errorMessage: string | undefined = '';
    const show =
      !!errors.email ||
      !!errors.objectId ||
      !!errors.role ||
      !!errors.firstname ||
      !!errors.lastname ||
      isError;

    if (isError && error?.response?.statusText === 'Conflict') {
      errorMessage = 'Email already exist';
    } else if (
      !!errors.email ||
      !!errors.objectId ||
      !!errors.role ||
      !!errors.firstname ||
      !!errors.lastname
    ) {
      errorMessage =
        errors?.email?.message ||
        errors?.objectId?.message ||
        errors?.role?.message ||
        errors?.firstname?.message ||
        errors?.lastname?.message;
    }

    return (
      <Alert variant="danger" show={show}>
        {errorMessage}
      </Alert>
    );
  };

  const closeModal = (): void => {
    resetForm({
      email: '',
      role: Role.ENCODER,
      objectId: '',
      firstname: '',
      lastname: '',
    });
    resetUseUpdateUser();
    onClose();
  };

  useEffect(() => {
    if (user) {
      resetForm({
        email: '',
        role: Role.ENCODER,
        objectId: '',
        firstname: '',
        lastname: '',
      });
      set('email', user?.email ? user.email : '');
      set('role', user?.role ? user.role : Role.ENCODER);
      set('objectId', '');
      set('firstname', user?.firstName ? user.firstName : '');
      set('lastname', user?.lastName ? user.lastName : '');
    }

    return () => {
      resetUseUpdateUser();
    };
  }, [user, resetForm, set, resetUseUpdateUser]);

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={onClose}
      centered
    >
      <Form onSubmit={handleSubmit(updateUser)}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>EDIT USER</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderErrorAlert()}
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Controller
              name="role"
              control={control}
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
          <Form.Group className="mb-3">
            <Form.Label>Personal Information</Form.Label>
            <Controller
              name="firstname"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Form.Control
                  {...field}
                  disabled={isLoading}
                  placeholder="First name"
                />
              )}
            />
            <br />
            <Controller
              name="lastname"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Form.Control
                  {...field}
                  disabled={isLoading}
                  placeholder="Last name"
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
            {isLoading ? ' Updating...' : 'Update'}
          </Button>
          <Button variant="outline-danger" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
