import { ReactElement } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { IEncoderFormValues } from '../../EncoderForm';

export interface CompanyCodeFieldProps {
  control: Control<IEncoderFormValues>;
}

export const CompanyCodeField = ({
  control,
}: CompanyCodeFieldProps): ReactElement => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name: 'companyCode',
    defaultValue: '',
  });

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
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default CompanyCodeField;
