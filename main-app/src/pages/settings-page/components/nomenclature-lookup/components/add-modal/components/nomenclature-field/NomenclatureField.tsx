import { ReactElement } from 'react';
import { Controller, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';

export interface NomenclatureFieldProps {
  control: Control<any>;
}

export const NomenclatureField = ({
  control,
}: NomenclatureFieldProps): ReactElement => (
  <Controller
    name="nomenclature"
    control={control}
    defaultValue=""
    rules={{ required: true }}
    render={({ field, fieldState: { invalid, error } }) => (
      <Form.Group className="mb-3">
        <Form.Label>Nomenclature</Form.Label>
        <Form.Control
          {...field}
          placeholder="Enter nomenclature"
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

export default NomenclatureField;
