import { ReactElement } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

export interface ObjectIdFieldProps {
  control: Control<FieldValues>;
}

export const ObjectIdField = ({
  control,
}: ObjectIdFieldProps): ReactElement => (
  <Controller
    name="objectId"
    control={control}
    defaultValue=""
    rules={{ required: true }}
    render={({ field, fieldState: { invalid, error } }) => (
      <Form.Group className="mb-3">
        <Form.Label>Object ID</Form.Label>
        <Form.Control
          {...field}
          placeholder="Enter object ID"
          isInvalid={invalid}
        />
        <Form.Control.Feedback type="invalid">
          {error?.message}
        </Form.Control.Feedback>
      </Form.Group>
    )}
  />
);

export default ObjectIdField;