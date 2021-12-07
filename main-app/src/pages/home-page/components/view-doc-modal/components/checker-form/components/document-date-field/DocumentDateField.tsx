import { ReactElement } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { ICheckerFormValues } from '../../CheckerForm';

export interface DocumentDateFieldProps {
  control: Control<ICheckerFormValues>;
}

export const DocumentDateField = ({
  control,
}: DocumentDateFieldProps): ReactElement => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: 'documentDate',
    defaultValue: '',
  });

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <b>Document Date</b>
      </Form.Label>
      <Form.Control {...field} type="date" isInvalid={!!error} />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default DocumentDateField;
