import { ReactElement, useState } from 'react';
import { NomenClature } from 'models';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useDeleteNomenClature } from 'hooks';
import {
  NomenClaturesTable,
  AddEditNomenClatureModal,
  ModalAction,
} from './components';

export const MngNomenClature = (): ReactElement => {
  const [selectedNomenClature, setSelectedNomenClature] = useState<
    NomenClature | undefined
  >(undefined);
  const [modalMode, setModalMode] = useState<ModalAction | undefined>(
    undefined,
  );

  const {
    isLoading: isDeleteLoading,
    isError: hasDeleteError,
    error: deleteError,
    mutateAsync: deleteAsync,
    reset: resetDelete,
  } = useDeleteNomenClature();

  const deleteNomenClature = async (): Promise<void> => {
    if (!selectedNomenClature) {
      alert('Please select an item.');
      return;
    }

    const { id, description } = selectedNomenClature;

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

  return (
    <div>
      <p className="fw-bold">Manage Nomen Clatures</p>
      <hr />
      <ButtonGroup aria-label="Basic example">
        <Button
          variant="outline-secondary"
          onClick={() => setModalMode(ModalAction.ADD)}
        >
          Add
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => setModalMode(ModalAction.EDIT)}
        >
          Edit
        </Button>
        <Button variant="outline-secondary" onClick={deleteNomenClature}>
          Delete
        </Button>
      </ButtonGroup>
      <div className="w-50 my-2">
        <Alert variant="danger" show={hasDeleteError}>
          {deleteError}
        </Alert>
        <NomenClaturesTable
          selectedNomenClature={selectedNomenClature}
          onSelectNomenClature={setSelectedNomenClature}
        />
        <AddEditNomenClatureModal
          isVisible={modalMode !== undefined}
          editId={selectedNomenClature?.id}
          actionMode={modalMode}
          onClose={() => setModalMode(undefined)}
        />
      </div>
    </div>
  );
};

export default MngNomenClature;
