import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './ReportStatusDropdown.module.css';

export interface StatusDropdownProps {
  onChange: (selected: StatusOption) => void;
  selected: StatusOption;
}

export interface IStatusDropdownOptions {
  label: string;
  value: StatusOption;
}

export enum StatusOption {
  UPLOADED = 'UPLOADED',
  INFORMATION_REQUEST = 'INFORMATION REQUEST',
  QUALITY_CHECKED = 'QUALITY CHECKED',
  APPROVAL = 'APPROVAL',
  IMPORT = 'IMPORT',
  RIS = 'RIS',
}

export const StatusDropdownOptions: IStatusDropdownOptions[] = [
  {
    label: 'Uploaded',
    value: StatusOption.UPLOADED,
  },
  {
    label: 'Information Request',
    value: StatusOption.INFORMATION_REQUEST,
  },
  {
    label: 'Quality Checked',
    value: StatusOption.QUALITY_CHECKED,
  },
  {
    label: 'Approval',
    value: StatusOption.APPROVAL,
  },
  {
    label: 'Import',
    value: StatusOption.IMPORT,
  },
  {
    label: 'RIS',
    value: StatusOption.RIS,
  },
];

export const ReportStatusDropdown = ({
  selected,
  onChange,
}: StatusDropdownProps): ReactElement => {
  const handleOnChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value as StatusOption);
  };

  return (
    <div>
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
    </div>
  );
};

export default ReportStatusDropdown;
