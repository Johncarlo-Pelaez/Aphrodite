import { ReactElement } from 'react';
import { useUsers } from 'hooks';
import Form from 'react-bootstrap/Form';
import styles from './UsersDropdown.module.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { DEFAULT_ALL_USER_SELECTED } from 'core/constants';

export interface UserDropdownProps {
  onChange: (username: string) => void;
}
export const AllUsers = [{ label: DEFAULT_ALL_USER_SELECTED }];

export const UsersDropdown = ({
  onChange,
}: UserDropdownProps): ReactElement => {
  const { data: users = [] } = useUsers();

  const onChangeUser = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value);
  };

  return (
    <div>
      <FloatingLabel label="Email Accounts">
        <Form.Select className={styles.select} onChange={onChangeUser}>
          {AllUsers.map((op, index) => (
            <option className={styles.prop} key={index} value={op.label}>
              {op.label}
            </option>
          ))}
          {users.map((op, index) => (
            <option className={styles.prop} key={index} value={op.username}>
              {op.username}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
    </div>
  );
};

export default UsersDropdown;
