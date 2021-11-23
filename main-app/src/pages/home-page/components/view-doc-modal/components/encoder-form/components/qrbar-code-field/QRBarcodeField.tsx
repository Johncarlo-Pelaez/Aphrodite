import { ReactElement } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { IEncoderFormValues } from '../../EncoderForm';

export interface QRBarcodeFieldProps {
  control: Control<IEncoderFormValues>;
}

export const QRBarcodeField = ({
  control,
}: QRBarcodeFieldProps): ReactElement => {
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name: 'qrBarCode',
    defaultValue: '',
  });

  return (
    <Form.Group className="mb-3">
      <Form.Label>
        <b>Barcode / QR Code</b>
      </Form.Label>
      <Form.Control
        ref={ref}
        placeholder="Barcode / QR Code"
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

export default QRBarcodeField;
