import { ReactElement } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

export interface IsActiveFieldProps {
  control: Control<FieldValues>;
}

export const IsActiveField = ({
  control,
}: IsActiveFieldProps): ReactElement => (
  <Controller
    name="isActive"
    control={control}
    defaultValue={'false'}
    render={({ field, fieldState: { invalid, error } }) => (
      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select {...field} isInvalid={invalid}>
          <option value={'true'}>Active</option>
          <option value={'false'}>Deactivate</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </Form.Group>
    )}
  />
);

export default IsActiveField;
