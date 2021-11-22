import { ReactElement, useState } from 'react';
import { Nomenclature } from 'models';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useDeleteNomenclature } from 'hooks';
import {
  NomenclaturesTable,
  AddEditNomenclatureModal,
  ModalAction,
} from './components';

export const MngNomenclature = (): ReactElement => {
  const [selectedNomenclature, setSelectedNomenclature] = useState<
    Nomenclature | undefined
  >(undefined);
  const [modalMode, setModalMode] = useState<ModalAction | undefined>(
    undefined,
  );
  const hasSelectNomenclature = !!selectedNomenclature;

  const {
    isLoading: isDeleteLoading,
    isError: hasDeleteError,
    error: deleteError,
    mutateAsync: deleteAsync,
    reset: resetDelete,
  } = useDeleteNomenclature();

  const deleteNomenClature = async (): Promise<void> => {
    if (!hasSelectNomenclature) {
      alert('Please select an item.');
      return;
    }

    const { id, description } = selectedNomenclature;

    const inputedDescription = prompt(
      `Please Enter "${description}" to delete.`,
    );

    if (inputedDescription === null) return;

    if (inputedDescription !== description) {
      alert('Not match!');
      return;
    }

    if (!isDeleteLoading) {
      await deleteAsync(id);
      resetDelete();
    }
  };

  const openEditModal = (): void => {
    if (!hasSelectNomenclature) {
      alert('Please select an item.');
      return;
    }

    setModalMode(ModalAction.EDIT);
  };

  const closeModal = (): void => {
    setModalMode(undefined);
    setSelectedNomenclature(undefined);
  };

  return (
    <div>
      <p className="fw-bold">Manage Nomenclature Whitelist</p>
      <hr />
      <ButtonGroup>
        <Button
          variant="outline-secondary"
          onClick={() => setModalMode(ModalAction.ADD)}
        >
          Add
        </Button>
        {hasSelectNomenclature && [
          <Button
            key="btn-edit"
            variant="outline-secondary"
            onClick={openEditModal}
            disabled={!hasSelectNomenclature}
          >
            Edit
          </Button>,
          <Button
            key="btn-delete"
            variant="outline-secondary"
            onClick={deleteNomenClature}
            disabled={!hasSelectNomenclature}
          >
            Delete
          </Button>,
        ]}
      </ButtonGroup>
      <div className="w-50 my-2">
        <Alert variant="danger" show={hasDeleteError}>
          {deleteError}
        </Alert>
        <NomenclaturesTable
          selectedNomenclature={selectedNomenclature}
          onSelectNomenclature={setSelectedNomenclature}
        />
        <AddEditNomenclatureModal
          editId={selectedNomenclature?.id}
          description={selectedNomenclature?.description}
          isVisible={modalMode !== undefined}
          actionMode={modalMode}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default MngNomenclature;
