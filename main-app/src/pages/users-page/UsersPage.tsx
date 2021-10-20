import { useState } from 'react';
import { Container, Button, Stack } from 'react-bootstrap';
import { User } from 'models';
import { UsersTable, AddUserModal } from './components';

export const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [openAddModal, setOpenModal] = useState<boolean>(false);

  return (
    <Container className="my-5">
      <Stack className="mb-5" direction="horizontal" gap={3}>
        <Button
          className="px-4"
          variant="dark"
          onClick={() => setOpenModal(true)}
        >
          Add
        </Button>
      </Stack>
      <UsersTable selectedUser={selectedUser} onSelectUser={setSelectedUser} />
      <AddUserModal
        isVisible={openAddModal}
        onClose={() => setOpenModal(false)}
      />
    </Container>
  );
};

export default UsersPage;
