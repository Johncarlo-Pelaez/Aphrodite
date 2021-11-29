import { ReactElement } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { Role } from 'core/enum';

export interface RoleFieldProps {
  control: Control<FieldValues>;
}

export const RoleField = ({ control }: RoleFieldProps): ReactElement => (
  <Controller
    name="role"
    control={control}
    defaultValue={Role.ENCODER}
    render={({ field, fieldState: { invalid, error } }) => (
      <Form.Group className="mb-3">
        <Form.Label>Role</Form.Label>
        <Form.Select {...field} isInvalid={invalid}>
          <option value={Role.ADMIN}>Administrator</option>
          <option value={Role.ENCODER}>Encoder</option>
          <option value={Role.REVIEWER}>Reviewer</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </Form.Group>
    )}
  />
);

export default RoleField;
