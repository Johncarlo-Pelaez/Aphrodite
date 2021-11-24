import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './OperationDropdown.module.css';

export interface OperationDropdownProps {
  onChange: (selected: string) => void;
  selected: string;
}

export interface IOperationDropdownOptions {
  label: string;
  value: string;
}

export const OperationDropdownOptions: IOperationDropdownOptions[] = [
  {
    label: 'All Operations',
    value: 'ALL',
  },
  {
    label: 'Manual Encoding',
    value: 'ENCODING',
  },
  {
    label: 'Information Request (Request to SalesForce)',
    value: 'INDEXING',
  },
  {
    label: 'Quality Checking',
    value: 'CHECKING',
  },
  {
    label: 'Document Import (Request to SpringCM)',
    value: 'MIGRATE',
  },
];

export const OperationDropdown = ({
  selected,
  onChange,
}: OperationDropdownProps): ReactElement => {
  const handleOnChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value);
  };

  return (
    <Form.Select
      className={styles.select}
      onChange={handleOnChange}
      value={selected}
    >
      {OperationDropdownOptions.map((op, index) => (
        <option key={index} value={op.value}>
          {op.label}
        </option>
      ))}
    </Form.Select>
  );
};

export default OperationDropdown;
