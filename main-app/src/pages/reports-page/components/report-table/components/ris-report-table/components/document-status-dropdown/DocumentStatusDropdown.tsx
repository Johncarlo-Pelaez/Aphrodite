import { ReactElement } from 'react';
import { DocumentStatus } from 'core/enum';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { DEFAULT_ALL_DOCUMNET_STATUS } from 'core/constants';
import styles from './DocumentStatusDropdown.module.css';

export const AllStatus = [{ label: DEFAULT_ALL_DOCUMNET_STATUS }];

export interface NomenclatureDropdownProps {
  onChange: (nomenclature: string) => void;
}

export const DocumentStatusDropdown = ({
  onChange,
}: NomenclatureDropdownProps): ReactElement => {
  const documentStatuses = Object.values(DocumentStatus);

  const onChangeDocumentStatus = (
    event: React.FormEvent<HTMLSelectElement>,
  ): void => {
    onChange(event.currentTarget.value);
  };
  return (
    <div>
      <FloatingLabel label="Document Status">
        <Form.Select
          className={styles.select}
          onChange={onChangeDocumentStatus}
        >
          {AllStatus.map((opt, index) => (
            <option className={styles.prop} key={index} value={opt.label}>
              {opt.label}
            </option>
          ))}
          {documentStatuses.map((opt, index) => (
            <option className={styles.prop} key={index} value={opt}>
              {opt}
            </option>
          ))}
        </Form.Select>
      </FloatingLabel>
    </div>
  );
};

export default DocumentStatusDropdown;
