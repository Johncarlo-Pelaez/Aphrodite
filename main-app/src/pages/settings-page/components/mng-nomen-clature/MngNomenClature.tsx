import { ReactElement, useState } from 'react';
import { NomenClature } from 'models';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import {
  useCreateNomenClature,
  useUpdateNomenClature,
  useDeleteNomenClature,
} from 'hooks';
import { NomenClaturesTable } from './components';

export const MngNomenClature = (): ReactElement => {
  const [selectedNomenClature, setSelectedNomenClature] = useState<
    NomenClature | undefined
  >(undefined);

  const {
    isLoading: isCreateLoading,
    isError: hasCreateError,
    error: createError,
    mutateAsync: createAsync,
    reset: resetCreate,
  } = useCreateNomenClature();

  const {
    isLoading: isUpdateLoading,
    isError: hasUpdateError,
    error: updateError,
    mutateAsync: updateAsync,
    reset: resetUpdate,
  } = useUpdateNomenClature();

  const {
    isLoading: isDeleteLoading,
    isError: hasDeleteError,
    error: deleteError,
    mutateAsync: deleteAsync,
    reset: resetDelete,
  } = useDeleteNomenClature();

  const createNomenClature = async (): Promise<void> => {
    const description = prompt('Enter Nomen Clature.');

    if (description === null) return;

    if (description === '') {
      alert('Description is required.');
      return;
    }

    if (!isCreateLoading) {
      await createAsync({ description });
      resetCreate();
    }
  };

  const updateNomenClature = async (): Promise<void> => {
    if (!selectedNomenClature) {
      alert('Please select an item.');
      return;
    }

    const { id, description } = selectedNomenClature;

    const newDescription = prompt('Enter Nomen Clature.', description);

    if (newDescription === null) return;

    if (newDescription === '') {
      alert('Description is required.');
      return;
    }

    if (!isUpdateLoading) {
      await updateAsync({ id, description: newDescription });
      resetUpdate();
    }
  };

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
        <Button variant="outline-secondary" onClick={createNomenClature}>
          Add
        </Button>
        <Button variant="outline-secondary" onClick={updateNomenClature}>
          Edit
        </Button>
        <Button variant="outline-secondary" onClick={deleteNomenClature}>
          Delete
        </Button>
      </ButtonGroup>
      <div className="w-50 my-2">
        <Alert variant="danger" show={hasCreateError}>
          {createError}
        </Alert>
        <Alert variant="danger" show={hasUpdateError}>
          {updateError}
        </Alert>
        <Alert variant="danger" show={hasDeleteError}>
          {deleteError}
        </Alert>
        <NomenClaturesTable
          selectedNomenClature={selectedNomenClature}
          onSelectNomenClature={setSelectedNomenClature}
        />
      </div>
    </div>
  );
};

export default MngNomenClature;
