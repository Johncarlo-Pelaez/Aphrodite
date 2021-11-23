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
    field: { onChange, value, ref },
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
        ref={ref}
        placeholder="Contract Number"
        onChange={onChange}
        value={value}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default ContractNumberField;
