import { ReactElement } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { IEncoderFormValues } from '../../EncoderForm';

export interface DocumentGroupFieldProps {
  control: Control<IEncoderFormValues>;
}

export const DocumentGroupField = ({
  control,
}: DocumentGroupFieldProps): ReactElement => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: 'documentGroup',
    defaultValue: '',
  });

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <b>Document Group</b>
      </Form.Label>
      <Form.Control
        {...field}
        readOnly
        placeholder="Enter document group"
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default DocumentGroupField;
