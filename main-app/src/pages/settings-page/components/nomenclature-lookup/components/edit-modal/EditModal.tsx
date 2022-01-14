import { ReactElement, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useUpdateNomenclatureLookup } from 'hooks';
import { nomenclatureLookup } from 'models';
import * as yup from 'yup';
import { NomenclatureField, DocumentGroupField } from '../add-modal/components';
import { CreateLookupForm } from '../';

interface UpdateLookupForm extends CreateLookupForm {
  id: number;
}

const editLookupSchema = yup.object().shape({
  nomenclature: yup.string().required('Nomenclature is required.'),
  documentGroup: yup.string().required('Document group is required.'),
});

export interface EditModalProps {
  lookup?: nomenclatureLookup;
  isVisible: boolean;
  onClose: () => void;
}

export const EditModal = ({
  lookup,
  isVisible,
  onClose: triggerClose,
}: EditModalProps): ReactElement => {
  const {
    isLoading: isUpdateLoading,
    isError: hasUpdateError,
    mutateAsync: updateAsync,
    reset: resetUpdate,
  } = useUpdateNomenclatureLookup();

  const {
    control,
    handleSubmit,
    setValue,
    reset: resetForm,
  } = useForm<UpdateLookupForm>({
    resolver: yupResolver(editLookupSchema),
  });

  const createNomenclature: SubmitHandler<UpdateLookupForm> = async (
    params,
  ): Promise<void> => {
    if (!isUpdateLoading && lookup) {
      await updateAsync({ ...params, id: lookup.id });
      alert('Update saved.');
      closeModal();
    }
  };

  const closeModal = (): void => {
    resetForm({ nomenclature: '', documentGroup: '' });
    triggerClose();
  };

  useEffect(() => {
    setValue('nomenclature', lookup?.nomenclature ?? '');
    setValue('documentGroup', lookup?.documentGroup ?? '');
    // eslint-disable-next-line
  }, [lookup]);

  useEffect(() => {
    return function componentCleanup() {
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
      <Form onSubmit={handleSubmit(createNomenclature)}>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>EDIT NOMENCLATURE LOOKUP</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger" show={hasUpdateError}>
            Failed to update nomenclature lookup.
          </Alert>
          <fieldset disabled={isUpdateLoading}>
            <NomenclatureField control={control} />
            <DocumentGroupField control={control} />
          </fieldset>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit" disabled={isUpdateLoading}>
            <Spinner
              hidden={!isUpdateLoading}
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            {isUpdateLoading ? ' Saving...' : 'Save'}
          </Button>
          <Button variant="outline-danger" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditModal;
