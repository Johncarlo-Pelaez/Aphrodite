import { useState, ReactElement } from 'react';
import Container from 'react-bootstrap/Container';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import { User } from 'models';
import {
  UsersTable,
  AddUserModal,
  UpdateUserModal,
  UserDetailsModal,
} from './components';

export const UsersPage = (): ReactElement => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [openAddModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const hasSelectUser = !!selectedUser;

  return (
    <Container className="my-4" fluid>
      <h4 className="fw-normal py-3">Users List</h4>
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
      <UsersTable selectedUser={selectedUser} onSelectUser={setSelectedUser} />
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
    </Container>
  );
};

export default UsersPage;
