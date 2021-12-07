import { ReactElement } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import styles from './DateSelect.module.css';

export interface DateSelectProps {
  value?: Date;
  label?: string;
  isInvalid?: boolean;
  error?: string;
  floatLabel?: boolean;
  onChange: (date?: Date) => void;
}

export const DateSelect = (props: DateSelectProps): ReactElement => {
  const {
    label,
    error,
    isInvalid,
    value,
    floatLabel = false,
    onChange: triggerChange,
  } = props;
  const strValue = value ? moment(value).format('yyyy-MM-DD') : '';

  const handleChange = (event: React.ChangeEvent<any>): void => {
    const strDate = event.target.value;
    triggerChange(strDate !== '' ? new Date(strDate) : undefined);
  };

  if (floatLabel) {
    return (
      <FloatingLabel className={styles.formSelect} label={label}>
        <Form.Control
          type="date"
          value={strValue}
          onChange={handleChange}
          isInvalid={isInvalid}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </FloatingLabel>
    );
  }

  return (
    <Form.Group className={styles.formSelect}>
      {label && (
        <Form.Label>
          <b>{label}</b>
        </Form.Label>
      )}
      <Form.Control
        type="date"
        value={strValue}
        onChange={handleChange}
        isInvalid={isInvalid}
      />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default DateSelect;
