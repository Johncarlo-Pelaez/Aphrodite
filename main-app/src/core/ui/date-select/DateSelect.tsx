import { ReactElement } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import styles from './DateSelect.module.css';

export interface DateSelectProps {
  value?: Date;
  label?: string;
  isInvalid?: boolean;
  error?: string;
  horizontal?: boolean;
  onChange: (date?: Date) => void;
}

export const DateSelect = (props: DateSelectProps): ReactElement => {
  const {
    label,
    error,
    isInvalid,
    value,
    horizontal = false,
    onChange: triggerChange,
  } = props;
  const strValue = value
    ? moment(value).format('yyyy-MM-DD')
    : moment(new Date()).format('yyyy-MM-DD');

  const handleChange = (event: React.ChangeEvent<any>): void => {
    const strDate = event.target.value;
    triggerChange(strDate !== '' ? new Date(strDate) : undefined);
  };

  if (horizontal) {
    return (
      <Form>
        <Form.Group as={Row} className="mb-3">
          {label && (
            <Form.Label column sm={2}>
              <b>{label}</b>
            </Form.Label>
          )}
          <Col sm={10}>
            <Form.Control
              type="date"
              value={strValue}
              onChange={handleChange}
              isInvalid={isInvalid}
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
      </Form>
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
