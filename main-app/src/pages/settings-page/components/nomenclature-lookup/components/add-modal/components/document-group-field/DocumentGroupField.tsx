import { ReactElement } from 'react';
import { Controller, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

export interface DocumentGroupFieldProps {
  control: Control<any>;
}

export const DocumentGroupField = ({
  control,
}: DocumentGroupFieldProps): ReactElement => (
  <Controller
    name="documentGroup"
    control={control}
    defaultValue=""
    rules={{ required: true }}
    render={({ field, fieldState: { invalid, error } }) => (
      <Form.Group className="mb-3">
        <Form.Label>Document Group</Form.Label>
        <Form.Control
          {...field}
          placeholder="Enter document group"
          onFocus={(event) => event.target.select()}
          isInvalid={invalid}
        />
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </Form.Group>
    )}
  />
);

export default DocumentGroupField;
