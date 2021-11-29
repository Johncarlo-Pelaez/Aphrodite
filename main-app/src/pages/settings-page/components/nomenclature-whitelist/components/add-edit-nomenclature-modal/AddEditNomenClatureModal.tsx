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
  description: yup.string().required('Nomenclature is required.'),
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
  onClose: triggerClose,
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

  const closeModal = (): void => {
    resetForm({ description: '' });
    triggerClose();
  };

  useEffect(() => {
    if (isEditMode) setValue('description', description ?? '');
    // eslint-disable-next-line
  }, [description, actionMode]);

  useEffect(() => {
    return function componentCleanup() {
      resetCreate();
      resetUpdate();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={closeModal}
      centered
    >
      <Form onSubmit={handleSubmit(getFormActionMethod())}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>{isEditMode ? 'EDIT' : 'ADD'} NOMEN CLATURE</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger" show={hasCreateError || hasUpdateError}>
            {isEditMode ? 'Update' : 'Create'} Nomenclature Failed.
          </Alert>
          <Controller
            name="description"
            control={control}
            rules={{ required: true }}
            defaultValue=""
            render={({ field, fieldState: { invalid, error } }) => (
              <Form.Group className="mb-3">
                <Form.Label>Nomenclature</Form.Label>
                <Form.Control
                  {...field}
                  disabled={isLoading}
                  placeholder="Enter nomenclature"
                  isInvalid={invalid}
                />
                <Form.Control.Feedback type="invalid">
                  {error?.message}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          />
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
