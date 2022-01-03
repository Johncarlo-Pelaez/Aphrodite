import { useState, ReactElement, Fragment } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { User } from 'models';
import { SearchField, DeleteModal } from 'core/ui';
import { useDeleteUser } from 'hooks';
import {
  UsersTable,
  AddUserModal,
  UpdateUserModal,
  UserDetailsModal,
} from './components';

export const Users = (): ReactElement => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const hasSelectUser = !!selectedUser;

  const {
    isLoading: isDeleteLoading,
    isError: hasDeleteError,
    error: deleteError,
    mutateAsync: deleteAsync,
    reset: resetDelete,
  } = useDeleteUser();

  const deleteUser = async (): Promise<void> => {
    if (!hasSelectUser) {
      alert('Please select a user.');
      return;
    }

    if (!isDeleteLoading) {
      await deleteAsync(selectedUser.id);
      resetDelete();
    }
  };

  const handleOpenEditModal = (): void => {
    if (!hasSelectUser) {
      alert('Please select a user.');
      return;
    }

    setIsEditModalOpen(true);
  };

  const handleOpenViewModal = (): void => {
    if (!hasSelectUser) {
      alert('Please select a user.');
      return;
    }

    setIsViewModalOpen(true);
  };

  const handleOpenDeleteModal = (): void => {
    if (!hasSelectUser) {
      alert('Please select a user.');
      return;
    }

    setIsDeleteModalOpen(true);
  };

  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleCloseDeleteModal = (): void => {
    setIsDeleteModalOpen(false);
    setSelectedUser(undefined);
  };

  return (
    <Fragment>
      <Alert variant="danger" show={hasDeleteError}>
        {deleteError}
      </Alert>
      <div className="d-flex justify-content-between align-items-center flex-wrap position-relative my-1">
        <ButtonGroup className="m-2">
          <Button
            variant="outline-secondary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add
          </Button>
          {hasSelectUser && [
            <Button
              key="btn-edit"
              variant="outline-secondary"
              onClick={handleOpenEditModal}
              disabled={!hasSelectUser}
            >
              Edit
            </Button>,
            <Button
              key="btn-view"
              variant="outline-secondary"
              onClick={handleOpenViewModal}
              disabled={!hasSelectUser}
            >
              View
            </Button>,
            <Button
              key="btn-delete"
              variant="outline-secondary"
              onClick={handleOpenDeleteModal}
              disabled={!hasSelectUser}
            >
              Delete
            </Button>,
          ]}
        </ButtonGroup>
        <SearchField searchKey={searchKey} onSearchDocument={setSearchKey} />
      </div>
      <UsersTable
        searchKey={searchKey}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <AddUserModal isVisible={isAddModalOpen} onClose={handleCloseAddModal} />
      <UpdateUserModal
        user={selectedUser}
        isVisible={isEditModalOpen}
        onClose={handleCloseEditModal}
      />
      <UserDetailsModal
        user={selectedUser}
        isVisible={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
      {hasSelectUser && (
        <DeleteModal
          isVisible={isDeleteModalOpen}
          title={selectedUser?.username}
          onDelete={deleteUser}
          onClose={handleCloseDeleteModal}
        />
      )}
    </Fragment>
  );
};

export default Users;
