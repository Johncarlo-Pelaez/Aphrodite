import { ReactElement, Fragment, useState } from 'react';
import { nomenclatureLookup } from 'models';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useDeleteNomenclatureLookup } from 'hooks';
import { SearchField } from 'core/ui';
import { LookupsTable, AddModal, EditModal } from './components';

export const NomenclatureLookup = (): ReactElement => {
  const [selectedlookup, setSelectedlookup] = useState<
    nomenclatureLookup | undefined
  >(undefined);
  const [isAddModal, setIsAddModal] = useState<boolean>(false);
  const [isEditModal, setIsEditModal] = useState<boolean>(false);
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

    const { id, nomenclature } = selectedlookup;

    const inputedNomenclature = prompt(
      `Please Enter "${nomenclature}" to delete.`,
    );

    if (inputedNomenclature === null) return;

    if (inputedNomenclature !== nomenclature) {
      alert('Not match!');
      return;
    }

    if (!isDeleteLoading) {
      await deleteAsync(id);
      resetDelete();
    }
  };

  const handleOpenEditModal = (): void => {
    if (!hasSelectedLookup) {
      alert('Please select an item.');
      return;
    }

    setIsEditModal(true);
  };

  const handleCloseAddModal = (): void => {
    setIsAddModal(false);
    setSelectedlookup(undefined);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModal(false);
    setSelectedlookup(undefined);
  };

  return (
    <Fragment>
      <ButtonGroup>
        <Button variant="outline-secondary" onClick={() => setIsAddModal(true)}>
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
            onClick={deleteLookup}
            disabled={!hasSelectedLookup}
          >
            Delete
          </Button>,
        ]}
      </ButtonGroup>
      <Alert variant="danger" show={hasDeleteError}>
        {deleteError}
      </Alert>
      <SearchField searchKey={searchKey} onSearchDocument={setSearchKey} />
      <LookupsTable
        searchKey={searchKey}
        selectedLookup={selectedlookup}
        onSelectLookup={setSelectedlookup}
      />
      <AddModal isVisible={isAddModal} onClose={handleCloseAddModal} />
      <EditModal
        lookup={selectedlookup}
        isVisible={isEditModal}
        onClose={handleCloseEditModal}
      />
    </Fragment>
  );
};

export default NomenclatureLookup;
