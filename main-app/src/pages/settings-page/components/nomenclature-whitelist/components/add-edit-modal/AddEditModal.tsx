import { ReactElement, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {
  useCreateNomenclatureWhitelist,
  useUpdateNomenclatureWhitelist,
} from 'hooks';
import * as yup from 'yup';
import { CreateNomenclatureWhitelistApi } from 'apis';

const addEditWhitelistSchema = yup.object().shape({
  description: yup.string().required('Nomenclature is required.'),
});

export enum ModalAction {
  ADD = 'add',
  EDIT = 'edit',
}

export interface AddEditModalProps {
  editId?: number;
  description?: string;
  isVisible: boolean;
  actionMode?: ModalAction;
  onClose: () => void;
}

export const AddEditModal = ({
  editId,
  description,
  isVisible,
  actionMode,
  onClose: triggerClose,
}: AddEditModalProps): ReactElement => {
  const {
    isLoading: isCreateLoading,
    isError: hasCreateError,
    mutateAsync: createAsync,
    reset: resetCreate,
  } = useCreateNomenclatureWhitelist();

  const {
    isLoading: isUpdateLoading,
    isError: hasUpdateError,
    mutateAsync: updateAsync,
    reset: resetUpdate,
  } = useUpdateNomenclatureWhitelist();

  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue,
  } = useForm<CreateNomenclatureWhitelistApi>({
    resolver: yupResolver(addEditWhitelistSchema),
  });

  const isLoading = isCreateLoading || isUpdateLoading;
  const isEditMode = actionMode === ModalAction.EDIT;
  const isAddMode = actionMode === ModalAction.ADD;

  const createNomenclature: SubmitHandler<CreateNomenclatureWhitelistApi> =
    async (params): Promise<void> => {
      if (!isCreateLoading && isAddMode) {
        await createAsync(params);
        alert('New whitelist has successfuly added.');
        closeModal();
      }
    };

  const updateNomenclature: SubmitHandler<CreateNomenclatureWhitelistApi> =
    async (params): Promise<void> => {
      if (!isUpdateLoading && editId && isEditMode) {
        await updateAsync({ id: editId, description: params.description });
        alert('Update saved.');
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
            <b>{isEditMode ? 'EDIT' : 'ADD'} NOMENCLATURE</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger" show={hasCreateError || hasUpdateError}>
            Failed to {isEditMode ? 'Update' : 'create new'} nomenclature.
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
                  onFocus={(event) => event.target.select()}
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

export default AddEditModal;
