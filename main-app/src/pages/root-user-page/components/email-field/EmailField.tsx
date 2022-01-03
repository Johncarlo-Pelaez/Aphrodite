import { ReactElement } from 'react';
import { Controller, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { CreateRootUserApi } from 'apis';

export interface EmailFieldProps {
  control: Control<CreateRootUserApi>;
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

export default EmailField;
