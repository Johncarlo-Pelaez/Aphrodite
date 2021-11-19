import { ReactElement } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { ICheckerFormValues } from '../../CheckerForm';

export interface RemarksFieldProps {
  control: Control<ICheckerFormValues>;
}

export const RemarksField = ({ control }: RemarksFieldProps): ReactElement => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name: 'remarks',
    defaultValue: '',
  });

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <b>Remarks</b>
      </Form.Label>
      <Form.Control
        ref={ref}
        placeholder="Remarks"
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

export default RemarksField;
