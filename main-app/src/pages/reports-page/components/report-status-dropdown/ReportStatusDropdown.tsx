import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import styles from './ReportStatusDropdown.module.css';

export interface StatusDropdownProps {
  onChange: (selected: ReportOption) => void;
  selected: ReportOption;
}

export interface IStatusDropdownOptions {
  label: string;
  value: ReportOption;
}

export enum ReportOption {
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
    value: ReportOption.UPLOADED,
  },
  {
    label: 'Information Request',
    value: ReportOption.INFORMATION_REQUEST,
  },
  {
    label: 'Quality Checked',
    value: ReportOption.QUALITY_CHECKED,
  },
  {
    label: 'Approval',
    value: ReportOption.APPROVAL,
  },
  {
    label: 'Import',
    value: ReportOption.IMPORT,
  },
  {
    label: 'RIS',
    value: ReportOption.RIS,
  },
];

export const ReportStatusDropdown = ({
  selected,
  onChange,
}: StatusDropdownProps): ReactElement => {
  const handleOnChange = (event: React.FormEvent<HTMLSelectElement>): void => {
    onChange(event.currentTarget.value as ReportOption);
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
