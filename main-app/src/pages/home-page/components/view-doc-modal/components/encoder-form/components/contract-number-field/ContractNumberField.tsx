import { ReactElement } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { IEncoderFormValues } from '../../EncoderForm';

export interface ContractNumberFieldProps {
  control: Control<IEncoderFormValues>;
}

export const ContractNumberField = ({
  control,
}: ContractNumberFieldProps): ReactElement => {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: 'contractNumber',
    defaultValue: '',
  });

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <b>Contract Number</b>
      </Form.Label>
      <Form.Control
        {...field}
        maxLength={13}
        placeholder="Enter contract number"
        onFocus={(event) => event.target.select()}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default ContractNumberField;
