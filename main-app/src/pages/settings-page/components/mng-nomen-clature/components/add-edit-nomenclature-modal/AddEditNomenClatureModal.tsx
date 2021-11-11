import { ReactElement } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useCreateNomenClature, useUpdateNomenClature } from 'hooks';
import * as yup from 'yup';
import { CreateNomenClatureApi } from 'apis';

const addEditNomenClatureSchema = yup.object().shape({
  description: yup.string().required('Description is required.'),
});

export enum ModalAction {
  ADD,
  EDIT,
}

export interface AddEditNomenClatureModalProps {
  isVisible: boolean;
  editId?: number;
  actionMode?: ModalAction;
  onClose: () => void;
}

export const AddEditNomenClatureModal = ({
  isVisible,
  editId,
  actionMode,
  onClose,
}: AddEditNomenClatureModalProps): ReactElement => {
  const {
    isLoading: isCreateLoading,
    isError: hasCreateError,
    mutateAsync: createAsync,
    reset: resetCreate,
  } = useCreateNomenClature();

  const {
    isLoading: isUpdateLoading,
    isError: hasUpdateError,
    mutateAsync: updateAsync,
    reset: resetUpdate,
  } = useUpdateNomenClature();

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateNomenClatureApi>({
    resolver: yupResolver(addEditNomenClatureSchema),
  });

  const isLoading = isCreateLoading || isUpdateLoading;
  const isEditMode = actionMode === ModalAction.EDIT;
  const isAddMode = actionMode === ModalAction.ADD;

  const createNomenClature: SubmitHandler<CreateNomenClatureApi> = async (
    params,
  ): Promise<void> => {
    if (!isCreateLoading && !editId && isAddMode) {
      await createAsync(params);
      closeModal();
    }
  };

  const updateNomenClature: SubmitHandler<CreateNomenClatureApi> = async (
    params,
  ): Promise<void> => {
    if (!isUpdateLoading && editId && isEditMode) {
      await updateAsync({ id: editId, description: params.description });
      closeModal();
    }
  };

  const getFormActionMethod = () => {
    if (isEditMode) return updateNomenClature;
    else return createNomenClature;
  };

  const renderErrorAlert = (): ReactElement => {
    let errorMessage: string | undefined = '';
    const show = !!errors.description || hasCreateError || hasUpdateError;

    if (hasCreateError || hasUpdateError) {
      errorMessage = 'Failed to save Nomen Clature.';
    } else if (!!errors.description) {
      errorMessage = errors?.description?.message;
    }

    return (
      <Alert variant="danger" show={show}>
        {errorMessage}
      </Alert>
    );
  };

  const closeModal = (): void => {
    resetCreate();
    resetUpdate();
    resetForm({ description: '' });
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
      <Form onSubmit={handleSubmit(getFormActionMethod())}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>{isEditMode ? 'EDIT' : 'ADD'} NOMEN CLATURE</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {renderErrorAlert()}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Form.Control
                  {...field}
                  disabled={isLoading}
                  placeholder="Enter description"
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

export default AddEditNomenClatureModal;