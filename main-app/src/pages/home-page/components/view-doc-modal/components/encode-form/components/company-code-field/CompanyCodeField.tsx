import { ReactElement, useState, useEffect } from 'react';
import { useController, Control, useWatch } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { IEncodeFormValues } from '../../EncodeForm';

export interface CompanyCodeFieldProps {
  control: Control<IEncodeFormValues>;
}

export const CompanyCodeField = ({
  control,
}: CompanyCodeFieldProps): ReactElement => {
  const [isRequired, setIsRequired] = useState<boolean>(true);
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name: 'companyCode',
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
        <b>Company Code</b>
      </Form.Label>
      <Form.Control
        ref={ref}
        placeholder="Company Code"
        onChange={onChange}
        value={value}
        isInvalid={!!error}
      />
      <Form.Control.Feedback type="invalid">
        {error?.type === 'required' && 'Company Code is required.'}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default CompanyCodeField;
