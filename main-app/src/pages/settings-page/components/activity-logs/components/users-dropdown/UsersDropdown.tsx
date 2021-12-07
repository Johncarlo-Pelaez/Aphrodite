import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './UsersDropdown.module.css';

import { useUsers } from 'hooks';

export const AllUsers = [{ label: 'All Users' }];

export interface UserDropdownProps {
  onChange: (username: string) => void;
}

export const UsersDropdown = ({
  onChange,
}: UserDropdownProps): ReactElement => {
  const { data: users = [] } = useUsers();

  const handleOnChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value);
  };

  return (
    <Form.Select className={styles.select} onChange={handleOnChange}>
      {AllUsers.map((op, index) => (
        <option key={index} value={op.label}>
          {op.label}
        </option>
      ))}
      {users.map((op, index) => (
        <option key={index} value={op.username}>
          {op.username}
        </option>
      ))}
    </Form.Select>
  );
};

export default UsersDropdown;
