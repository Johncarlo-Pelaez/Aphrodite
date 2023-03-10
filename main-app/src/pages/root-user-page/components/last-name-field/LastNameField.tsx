import { ReactElement } from 'react';
import { Controller, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { CreateRootUserApi } from 'apis';

export interface LastNameFieldProps {
  control: Control<CreateRootUserApi>;
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
        <Form.Label>Last Name</Form.Label>
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
