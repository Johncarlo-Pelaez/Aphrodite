import { ReactElement, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useCreateNomenclature, useUpdateNomenclature } from 'hooks';
import * as yup from 'yup';
import { CreateNomenclatureApi } from 'apis';

const addEditNomenclatureSchema = yup.object().shape({
  description: yup.string().required('Description is required.'),
});

export enum ModalAction {
  ADD = 'add',
  EDIT = 'edit',
}

export interface AddEditNomenclatureModalProps {
  editId?: number;
  description?: string;
  isVisible: boolean;
  actionMode?: ModalAction;
  onClose: () => void;
}

export const AddEditNomenclatureModal = ({
  editId,
  description,
  isVisible,
  actionMode,
  onClose,
}: AddEditNomenclatureModalProps): ReactElement => {
  const {
    isLoading: isCreateLoading,
    isError: hasCreateError,
    mutateAsync: createAsync,
    reset: resetCreate,
  } = useCreateNomenclature();

  const {
    isLoading: isUpdateLoading,
    isError: hasUpdateError,
    mutateAsync: updateAsync,
    reset: resetUpdate,
  } = useUpdateNomenclature();

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
    setValue,
  } = useForm<CreateNomenclatureApi>({
    resolver: yupResolver(addEditNomenclatureSchema),
  });

  const isLoading = isCreateLoading || isUpdateLoading;
  const isEditMode = actionMode === ModalAction.EDIT;
  const isAddMode = actionMode === ModalAction.ADD;

  const createNomenclature: SubmitHandler<CreateNomenclatureApi> = async (
    params,
  ): Promise<void> => {
    if (!isCreateLoading && isAddMode) {
      await createAsync(params);
      closeModal();
    }
  };

  const updateNomenclature: SubmitHandler<CreateNomenclatureApi> = async (
    params,
  ): Promise<void> => {
    if (!isUpdateLoading && editId && isEditMode) {
      await updateAsync({ id: editId, description: params.description });
      closeModal();
    }
  };

  const getFormActionMethod = () => {
    if (isEditMode) return updateNomenclature;
    else return createNomenclature;
  };

  const renderErrorAlert = (): ReactElement => {
    let errorMessage: string | undefined = '';
    const show = !!errors.description || hasCreateError || hasUpdateError;

    if (hasCreateError || hasUpdateError) {
      errorMessage = 'Failed to save Nomenclature.';
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

  useEffect(() => {
    if (isEditMode) setValue('description', description ?? '');
    // eslint-disable-next-line
  }, [description, actionMode]);

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

export default AddEditNomenclatureModal;
