import { ReactElement, Fragment, useState } from 'react';
import { nomenclatureLookup } from 'models';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useDeleteNomenclatureLookup } from 'hooks';
import { SearchField, DeleteModal } from 'core/ui';
import { LookupsTable, AddModal, EditModal } from './components';

export const NomenclatureLookup = (): ReactElement => {
  const [selectedlookup, setSelectedlookup] = useState<
    nomenclatureLookup | undefined
  >(undefined);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const hasSelectedLookup = !!selectedlookup;

  const {
    isLoading: isDeleteLoading,
    isError: hasDeleteError,
    error: deleteError,
    mutateAsync: deleteAsync,
    reset: resetDelete,
  } = useDeleteNomenclatureLookup();

  const deleteLookup = async (): Promise<void> => {
    if (!hasSelectedLookup) {
      alert('Please select an item.');
      return;
    }

    if (!isDeleteLoading) {
      await deleteAsync(selectedlookup?.id);
      resetDelete();
    }
  };

  const handleOpenEditModal = (): void => {
    if (!hasSelectedLookup) {
      alert('Please select an item.');
      return;
    }

    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (): void => {
    if (!hasSelectedLookup) {
      alert('Please select an item.');
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
    setSelectedlookup(undefined);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
    setSelectedlookup(undefined);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setSelectedlookup(undefined);
  };

  return (
    <Fragment>
      <Alert variant="danger" show={hasDeleteError}>
        {deleteError}
      </Alert>
      <div className="d-flex justify-content-between align-items-center flex-wrap my-2">
        <ButtonGroup>
          <Button
            variant="outline-secondary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add
          </Button>
          {hasSelectedLookup && [
            <Button
              key="btn-edit"
              variant="outline-secondary"
              onClick={handleOpenEditModal}
              disabled={!hasSelectedLookup}
            >
              Edit
            </Button>,
            <Button
              key="btn-delete"
              variant="outline-secondary"
              onClick={handleOpenDeleteModal}
              disabled={!hasSelectedLookup}
            >
              Delete
            </Button>,
          ]}
        </ButtonGroup>
        <SearchField searchKey={searchKey} onSearchDocument={setSearchKey} />
      </div>
      <LookupsTable
        searchKey={searchKey}
        selectedLookup={selectedlookup}
        onSelectLookup={setSelectedlookup}
      />
      <AddModal isVisible={isAddModalOpen} onClose={handleCloseAddModal} />
      <EditModal
        lookup={selectedlookup}
        isVisible={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
      {hasSelectedLookup && (
        <DeleteModal
          isVisible={isDeleteModalOpen}
          title={selectedlookup?.nomenclature}
          onDelete={deleteLookup}
          onClose={handleCloseDeleteModal}
        />
      )}
    </Fragment>
  );
};

export default NomenclatureLookup;
