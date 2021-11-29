import { ReactElement, useState } from 'react';
import { useUsers } from 'hooks';
import { Table, TableColumnProps } from 'core/ui/table';
import { User } from 'models';
import { UsersTableProps } from './UsersTable.types';

const columns: TableColumnProps<User>[] = [
  {
    title: 'Name',
    dataIndex: 'firstName',
    render: (user: User) => {
      return user.firstName
        ? `${
            user.firstName?.charAt(0).toUpperCase() + user.firstName?.slice(1)
          } ${user.lastName?.charAt(0).toUpperCase() + user.lastName?.slice(1)}`
        : '';
    },
  },
  {
    title: 'Email',
    dataIndex: 'username',
  },
];

export const UsersTable = ({
  selectedUser,
  onSelectUser: triggerSelectUser,
}: UsersTableProps): ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const {
    isLoading: isDocsLoading,
    isError: hasDocsError,
    data: users = [],
  } = useUsers();

  const total = users.length;

  const handleSelectRow = (selected: User): void => {
    triggerSelectUser(selected.id === selectedUser?.id ? undefined : selected);
  };

  return (
    <Table<User>
      rowKey={(user) => user.id}
      loading={isDocsLoading}
      isError={hasDocsError}
      columns={columns}
      data={users}
      pagination={{
        total: total,
        pageSize: pageSize,
        current: currentPage,
        pageNumber: 5,
        onChange: setCurrentPage,
        onSizeChange: setPageSize,
      }}
      selectedRow={selectedUser}
      onSelectRow={handleSelectRow}
    />
  );
};

export default UsersTable;
