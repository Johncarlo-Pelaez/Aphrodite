import React, { ReactElement, useState } from 'react';
import { NomenclatureWhitelist } from 'models';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useDeleteNomenclatureWhitelist } from 'hooks';
import { WhitelistTable, AddEditModal, ModalAction } from './components';

export const NomenclatureWhiteList = (): ReactElement => {
  const [selectedWhitelist, setSelectedWhitelist] = useState<
    NomenclatureWhitelist | undefined
  >(undefined);
  const [modalMode, setModalMode] = useState<ModalAction | undefined>(
    undefined,
  );
  const hasSelectNomenclature = !!selectedWhitelist;
  const isModalOpen = !!modalMode;

  const {
    isLoading: isDeleteLoading,
    isError: hasDeleteError,
    error: deleteError,
    mutateAsync: deleteAsync,
    reset: resetDelete,
  } = useDeleteNomenclatureWhitelist();

  const deleteWhitelist = async (): Promise<void> => {
    if (!hasSelectNomenclature) {
      alert('Please select an item.');
      return;
    }

    const { id, description } = selectedWhitelist;

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

  const handleOpenEditModal = (): void => {
    if (!hasSelectNomenclature) {
      alert('Please select an item.');
      return;
    }

    setModalMode(ModalAction.EDIT);
  };

  const handleOpenAddModal = (): void => {
    setModalMode(ModalAction.ADD);
  };

  const closeModal = (): void => {
    setModalMode(undefined);
    setSelectedWhitelist(undefined);
  };

  return (
    <React.Fragment>
      <ButtonGroup>
        <Button variant="outline-secondary" onClick={handleOpenAddModal}>
          Add
        </Button>
        {hasSelectNomenclature && [
          <Button
            key="btn-edit"
            variant="outline-secondary"
            onClick={handleOpenEditModal}
            disabled={!hasSelectNomenclature}
          >
            Edit
          </Button>,
          <Button
            key="btn-delete"
            variant="outline-secondary"
            onClick={deleteWhitelist}
            disabled={!hasSelectNomenclature}
          >
            Delete
          </Button>,
        ]}
      </ButtonGroup>
      <Alert variant="danger" show={hasDeleteError}>
        {deleteError}
      </Alert>
      <WhitelistTable
        selectedWhitelist={selectedWhitelist}
        onSelectWhitelist={setSelectedWhitelist}
      />
      <AddEditModal
        editId={selectedWhitelist?.id}
        description={selectedWhitelist?.description}
        isVisible={isModalOpen}
        actionMode={modalMode}
        onClose={closeModal}
      />
    </React.Fragment>
  );
};

export default NomenclatureWhiteList;