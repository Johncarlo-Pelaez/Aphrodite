import { ReactElement, useEffect } from 'react';
import { UpdateUserApiParams } from 'apis';
import { Role } from 'core/enum';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUpdateUser } from 'hooks';
import { User } from 'models';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import {
  RoleField,
  LastNameField,
  FirstNameField,
} from '../add-user-modal/components';
import { IsActiveField } from './components';

interface UpdateUserForm extends UpdateUserApiParams, FieldValues {}

export const updateUserSchema = yup.object().shape({
  role: yup
    .mixed<Role>()
    .oneOf(Object.values(Role))
    .required('Role is required.'),
  firstName: yup.string().required('First name must be filled'),
  lastName: yup.string().required('Last name must be filled'),
  isActive: yup.boolean().required('Active is required'),
});

interface ReadOnlyFieldProps {
  label: string;
  value?: string;
}

export const ReadOnlyField = ({
  label,
  value = '',
}: ReadOnlyFieldProps): ReactElement => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control value={value} readOnly />
  </Form.Group>
);

export interface UpdateUserModalProps {
  user?: User;
  isVisible: boolean;
  onClose: () => void;
}

export const UpdateUserModal = ({
  user,
  isVisible,
  onClose: triggerClose,
}: UpdateUserModalProps): ReactElement => {
  const hasUserSelected = !!user;
  const {
    isLoading,
    isError,
    mutateAsync: updateUserAsync,
    reset: resetUseUpdateUser,
  } = useUpdateUser();

  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue,
  } = useForm<UpdateUserForm>({
    resolver: yupResolver(updateUserSchema),
  });

  const updateUser: SubmitHandler<UpdateUserForm> = async (
    params,
  ): Promise<void> => {
    if (hasUserSelected && !isLoading) {
      await updateUserAsync({ ...params, id: user?.id });
      alert('Update saved.');
      triggerClose();
    }
  };

  const handleClose = (): void => {
    resetForm({
      role: Role.ENCODER,
      firstName: '',
      lastName: '',
      isActive: true,
    });
    triggerClose();
  };

  useEffect(() => {
    setValue('role', user?.role ?? Role.ENCODER);
    setValue('firstName', user?.firstName ?? '');
    setValue('lastName', user?.lastName ?? '');
    setValue('isActive', user?.isActive ?? true);
    // eslint-disable-next-line
  }, [user, isVisible]);

  useEffect(() => {
    return function componentCleanup() {
      resetUseUpdateUser();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={handleClose}
      centered
    >
      <Form onSubmit={handleSubmit(updateUser)}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>EDIT USER</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger" show={isError}>
            {'Failed to update user information.'}
          </Alert>
          <fieldset disabled={isLoading}>
            <RoleField control={control} />
            <FirstNameField control={control} />
            <LastNameField control={control} />
            <ReadOnlyField label="Email" value={user?.username} />
            <ReadOnlyField label="Object ID" value={user?.objectId} />
            <IsActiveField control={control} />
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
            {isLoading ? ' Updating...' : 'Update'}
          </Button>
          <Button variant="outline-danger" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
