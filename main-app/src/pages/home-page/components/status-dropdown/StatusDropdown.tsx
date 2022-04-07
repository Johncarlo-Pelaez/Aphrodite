import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './StatusDropdown.module.css';
import { OperationOption } from '../operation-dropdown';
import { Role } from 'core/enum';

export interface StatusDropdownProps {
  selectedOperation?: OperationOption;
  selected: StatusOption;
  currentUserRole?: Role | undefined;
  onChange: (selected: StatusOption) => void;
}

export interface IStatusDropdownOptions {
  label: string;
  value: StatusOption;
}

export enum StatusOption {
  ALL = 'ALL',
  FAILED = 'FAILED',
  BEGIN = 'BEGIN',
  WAITING = 'WAITING',
  DONE = 'DONE',
  DISAPPROVED = 'DISAPPROVED',
}

export const StatusDropdownOptions: IStatusDropdownOptions[] = [
  {
    label: 'All status',
    value: StatusOption.ALL,
  },
  {
    label: 'Error',
    value: StatusOption.FAILED,
  },
  {
    label: 'Processing',
    value: StatusOption.BEGIN,
  },
  {
    label: 'Waiting',
    value: StatusOption.WAITING,
  },
  {
    label: 'Success',
    value: StatusOption.DONE,
  },
];

export const StatusDropdown = ({
  selectedOperation,
  selected,
  onChange,
  currentUserRole,
}: StatusDropdownProps): ReactElement => {
  const handleOnChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value as StatusOption);
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
      {currentUserRole !== Role.ENCODER &&
        selectedOperation === OperationOption.CHECKING && (
          <option value={StatusOption.DISAPPROVED}>Disapproved</option>
        )}
    </Form.Select>
  );
};

export default StatusDropdown;
