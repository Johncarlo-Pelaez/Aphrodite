import { ReactElement } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

export interface EmailFieldProps {
  control: Control<FieldValues>;
}

export const EmailField = ({ control }: EmailFieldProps): ReactElement => (
  <Controller
    name="email"
    control={control}
    defaultValue=""
    rules={{ required: true }}
    render={({ field, fieldState: { invalid, error } }) => (
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          {...field}
          type="email"
          placeholder="Enter email address"
          isInvalid={invalid}
        />
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </Form.Group>
    )}
  />
);

export default EmailField;
