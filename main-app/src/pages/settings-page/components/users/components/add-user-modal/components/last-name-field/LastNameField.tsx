import { ReactElement } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

export interface LastNameFieldProps {
  control: Control<FieldValues>;
}

export const LastNameField = ({
  control,
}: LastNameFieldProps): ReactElement => (
  <Controller
    name="lastName"
    control={control}
    defaultValue=""
    rules={{ required: true }}
    render={({ field, fieldState: { invalid, error } }) => (
      <Form.Group className="mb-3">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          {...field}
          placeholder="Enter Last Name"
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

export default LastNameField;
