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
  const [openAddModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [searchKey, setSearchKey] = useState<string>('');
  const hasSelectUser = !!selectedUser;

  return (
    <Fragment>
      <ButtonGroup>
        <Button variant="outline-secondary" onClick={() => setOpenModal(true)}>
          Add
        </Button>
        {hasSelectUser && [
          <Button
            key="btn-edit"
            variant="outline-secondary"
            onClick={() => setOpenEditModal(true)}
            disabled={!hasSelectUser}
          >
            Edit
          </Button>,
          <Button
            key="btn-view"
            variant="outline-secondary"
            onClick={() => setOpenViewModal(true)}
            disabled={!hasSelectUser}
          >
            View
          </Button>,
        ]}
      </ButtonGroup>
      <SearchField searchKey={searchKey} onSearchDocument={setSearchKey} />
      <UsersTable
        searchKey={searchKey}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <AddUserModal
        isVisible={openAddModal}
        onClose={() => setOpenModal(false)}
      />
      <UpdateUserModal
        user={selectedUser}
        isVisible={openEditModal}
        onClose={() => setOpenEditModal(false)}
      />
      <UserDetailsModal
        user={selectedUser}
        isVisible={openViewModal}
        onClose={() => setOpenViewModal(false)}
      />
    </Fragment>
  );
};

export default Users;
