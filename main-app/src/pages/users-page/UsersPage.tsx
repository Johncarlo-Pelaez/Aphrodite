import { useState, ReactElement } from 'react';
import { Container, Button, Stack } from 'react-bootstrap';
import { User } from 'models';
import {
  UsersTable,
  AddUserModal,
  UpdateUserModal,
  DeleteUserModal,
} from './components';

export const UsersPage = (): ReactElement => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [openAddModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  return (
    <Container className="my-4">
      <h4 className="fw-normal py-3">Users List</h4>
      <Stack className="my-2" direction="horizontal" gap={3}>
        <Button
          className="px-4"
          variant="dark"
          onClick={() => setOpenModal(true)}
        >
          Add
        </Button>
        <Button
          className="px-4"
          variant="dark"
          onClick={() => setOpenEditModal(true)}
          disabled={!selectedUser}
        >
          Edit
        </Button>
        <Button
          className="px-4"
          variant="danger"
          onClick={() => setOpenDeleteModal(true)}
          disabled={!selectedUser}
        >
          Delete
        </Button>
      </Stack>
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
      <DeleteUserModal
        user={selectedUser}
        isVisible={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
      />
    </Container>
  );
};

export default UsersPage;
