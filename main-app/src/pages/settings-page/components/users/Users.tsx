import { useState, ReactElement, Fragment } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { User } from 'models';
import { SearchField } from 'core/ui';
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
  const [searchKey, setSearchKey] = useState<string>('');
  const hasSelectUser = !!selectedUser;

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

  const handleCloseAddModal = (): void => {
    setIsAddModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleCloseEditModal = (): void => {
    setIsEditModalOpen(false);
    setSelectedUser(undefined);
  };

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center flex-wrap my-2">
        <ButtonGroup>
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
    </Fragment>
  );
};

export default Users;
