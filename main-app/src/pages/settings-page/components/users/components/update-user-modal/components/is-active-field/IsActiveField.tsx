import { ReactElement } from 'react';
import { Controller, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

export interface IsActiveFieldProps {
  control: Control<any>;
}

export const IsActiveField = ({
  control,
}: IsActiveFieldProps): ReactElement => (
  <Controller
    name="isActive"
    control={control}
    defaultValue={false}
    render={({
      field: { onChange, value, ref },
      fieldState: { invalid, error },
    }) => (
      <Form.Group className="mb-3">
        <Form.Check
          ref={ref}
          type="checkbox"
          label="Active"
          onChange={onChange}
          checked={value}
          isInvalid={invalid}
        />
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </Form.Group>
    )}
  />
);

export default IsActiveField;
