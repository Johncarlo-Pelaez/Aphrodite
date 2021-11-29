import { ReactElement, useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useCreateNomenclatureLookup } from 'hooks';
import * as yup from 'yup';
import { CreateNomenclatureLookupApi } from 'apis';
import { NomenclatureField, DocumentGroupField } from './components';

interface CreateLookupForm extends CreateNomenclatureLookupApi, FieldValues {}

const addLookupSchema = yup.object().shape({
  nomenclature: yup.string().required('Nomenclature is required.'),
  documentGroup: yup.string().required('Document group is required.'),
});

export interface AddModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const AddModal = ({
  isVisible,
  onClose: triggerClose,
}: AddModalProps): ReactElement => {
  const {
    isLoading: isCreateLoading,
    isError: hasCreateError,
    mutateAsync: createAsync,
    reset: resetCreate,
  } = useCreateNomenclatureLookup();

  const {
    control,
    handleSubmit,
    reset: resetForm,
  } = useForm<CreateLookupForm>({
    resolver: yupResolver(addLookupSchema),
  });

  const createNomenclature: SubmitHandler<CreateLookupForm> = async (
    params,
  ): Promise<void> => {
    if (!isCreateLoading) {
      await createAsync(params);
      alert('New lookup has successfuly added.');
      closeModal();
    }
  };

  const closeModal = (): void => {
    resetForm({ nomenclature: '', documentGroup: '' });
    triggerClose();
  };

  useEffect(() => {
    return function componentCleanup() {
      resetCreate();
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
      <Form onSubmit={handleSubmit(createNomenclature)}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>ADD NOMENCLATURE LOOKUP</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger" show={hasCreateError}>
            Failed to create new nomenclature lookup.
          </Alert>
          <fieldset disabled={isCreateLoading}>
            <NomenclatureField control={control} />
            <DocumentGroupField control={control} />
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={isCreateLoading}>
            <Spinner
              hidden={!isCreateLoading}
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            {isCreateLoading ? ' Saving...' : 'Save'}
          </Button>
          <Button variant="outline-danger" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddModal;
