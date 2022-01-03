import { ReactElement } from 'react';
import { Controller, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { CreateRootUserApi } from 'apis';

export interface ObjectIdFieldProps {
  control: Control<CreateRootUserApi>;
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

export default ObjectIdField;
