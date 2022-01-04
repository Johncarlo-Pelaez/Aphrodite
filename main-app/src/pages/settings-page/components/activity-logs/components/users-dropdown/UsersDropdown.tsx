import { ReactElement } from 'react';
import { useUsers } from 'hooks';
import Form from 'react-bootstrap/Form';
import styles from './UsersDropdown.module.css';
import { DEFAULT_ALL_USER_SELECTED } from 'core/constants';

export interface UserDropdownProps {
  onChange: (username: string) => void;
}

export const UsersDropdown = ({
  onChange,
}: UserDropdownProps): ReactElement => {
  const { data: users = [] } = useUsers();

  const onChangeUser = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value);
  };

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Select className={styles.select} onChange={onChangeUser}>
          <option className={styles.prop} value={DEFAULT_ALL_USER_SELECTED}>
            {DEFAULT_ALL_USER_SELECTED}
          </option>
          {users.map((op, index) => (
            <option className={styles.prop} key={index} value={op.username}>
              {op.username}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </Form>
  );
};

export default UsersDropdown;
