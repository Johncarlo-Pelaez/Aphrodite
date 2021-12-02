import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './OperationDropdown.module.css';

export interface OperationDropdownProps {
  onChange: (selected: OperationOption) => void;
  selected: OperationOption;
}

export interface IOperationDropdownOptions {
  label: string;
  value: string;
}

export enum OperationOption {
  ALL = 'ALL',
  ENCODING = 'ENCODING',
  INDEXING = 'INDEXING',
  CHECKING = 'CHECKING',
  MIGRATE = 'MIGRATE',
}

export const OperationDropdownOptions: IOperationDropdownOptions[] = [
  {
    label: 'All Operations',
    value: OperationOption.ALL,
  },
  {
    label: 'Manual Encoding',
    value: OperationOption.ENCODING,
  },
  {
    label: 'Information Request (Request to SalesForce)',
    value: OperationOption.INDEXING,
  },
  {
    label: 'Quality Checking',
    value: OperationOption.CHECKING,
  },
  {
    label: 'Document Import (Request to SpringCM)',
    value: OperationOption.MIGRATE,
  },
];

export const OperationDropdown = ({
  selected,
  onChange,
}: OperationDropdownProps): ReactElement => {
  const handleOnChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value as OperationOption);
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
