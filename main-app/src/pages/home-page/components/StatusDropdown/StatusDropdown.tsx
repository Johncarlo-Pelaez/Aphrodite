import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './StatusDropdown.module.css';

export interface StatusDropdownProps {
  onChange: (selected: string) => void;
  selected: string;
}

export interface IStatusDropdownOptions {
  label: string;
  value: string;
}

export const StatusDropdownOptions: IStatusDropdownOptions[] = [
  {
    label: 'All status',
    value: 'ALL',
  },
  {
    label: 'Error',
    value: 'FAILED',
  },
  {
    label: 'Processing',
    value: 'BEGIN',
  },
  {
    label: 'Waiting',
    value: 'WAITING',
  },
  {
    label: 'Success',
    value: 'DONE',
  },
];

export const StatusDropdown = ({
  selected,
  onChange,
}: StatusDropdownProps): ReactElement => {
  const handleOnChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value);
  };

  return (
    <Form.Select
      className={styles.select}
      onChange={handleOnChange}
      value={selected}
    >
      {StatusDropdownOptions.map((op, index) => (
        <option key={index} value={op.value}>
          {op.label}
        </option>
      ))}
    </Form.Select>
  );
};

export default StatusDropdown;
