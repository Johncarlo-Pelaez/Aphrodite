import { ReactElement, useState, useEffect } from 'react';
import { useController, Control, useWatch } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { IEncodeFormValues } from '../../EncodeForm';

export interface ContractNumberFiledProps {
  control: Control<IEncodeFormValues>;
}

export const ContractNumberFiled = ({
  control,
}: ContractNumberFiledProps): ReactElement => {
  const [isRequired, setIsRequired] = useState<boolean>(true);
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name: 'contractNumber',
    rules: { required: isRequired },
    defaultValue: '',
  });

  const qrBarCode = useWatch({
    control,
    name: 'qrBarCode',
  });

  useEffect(() => {
    setIsRequired(qrBarCode.trim() === '');
  }, [qrBarCode]);

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
        {error?.type === 'required' && 'Contract Number is required.'}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default ContractNumberFiled;
