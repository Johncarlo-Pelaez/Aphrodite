import { ReactElement } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { IEncodeFormValues } from '../../EncodeForm';

export interface DocumentGroupFieldProps {
  control: Control<IEncodeFormValues>;
}

export const DocumentGroupField = ({
  control,
}: DocumentGroupFieldProps): ReactElement => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name: 'documentGroup',
    rules: { required: true },
    defaultValue: '',
  });

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <b>Document Group</b>
      </Form.Label>
      <Form.Control
        readOnly
        ref={ref}
        placeholder="Document Group"
        onChange={onChange}
        value={value}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">
        {error?.type === 'required' && 'Document Group is required.'}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default DocumentGroupField;
