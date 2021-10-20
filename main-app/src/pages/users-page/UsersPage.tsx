import { useState } from 'react';
import { Container, Button, Stack } from 'react-bootstrap';
import { User } from 'models';
import { UsersTable } from './components';

export const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  return (
    <Container className="my-5">
      <Stack className="mb-5" direction="horizontal" gap={3}>
        <Button className="px-4" variant="dark">
          Add
        </Button>
      </Stack>
      <UsersTable selectedUser={selectedUser} onSelectUser={setSelectedUser} />
    </Container>
  );
};

export default UsersPage;
