import { ReactElement, useState, useEffect, useMemo } from 'react';
import { useUsers } from 'hooks';
import { Table, TableColumnProps } from 'core/ui';
import { User } from 'models';

export interface UsersTableProps {
  searchKey: string;
  selectedUser?: User;
  onSelectUser: (user?: User) => void;
}

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

export const UsersTable = (props: UsersTableProps): ReactElement => {
  const { searchKey, selectedUser, onSelectUser: triggerSelectUser } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const {
    isLoading: isDocsLoading,
    isError: hasDocsError,
    data = [],
  } = useUsers();
  const { users, total } = useMemo(() => {
    let users = data;
    if (searchKey)
      users = users?.filter((data: User) =>
        Object.values(data).some((value) =>
          value?.toString().toLowerCase().includes(searchKey.toLowerCase()),
        ),
      );
    const total = users.length;
    return { users, total };
  }, [data, searchKey]);

  const handleSelectRow = (selected: User): void => {
    triggerSelectUser(selected.id === selectedUser?.id ? undefined : selected);
  };

  useEffect(
    function removeOutOfRangeSelectedRow() {
      const start = (currentPage - 1) * pageSize;
      const end = currentPage * pageSize;
      const pageKeys = users.slice(start, end).map((u) => u.id);
      if (!pageKeys.some((k) => k === selectedUser?.id))
        triggerSelectUser(undefined);
    },
    // eslint-disable-next-line
    [currentPage, pageSize, users, selectedUser],
  );

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
