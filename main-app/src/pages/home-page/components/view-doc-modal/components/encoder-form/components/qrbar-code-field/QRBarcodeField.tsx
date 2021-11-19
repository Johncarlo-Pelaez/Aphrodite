import { ReactElement, useState, useEffect } from 'react';
import { useController, Control, useWatch } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { IEncoderFormValues } from '../../EncoderForm';

export interface QRBarcodeFieldProps {
  control: Control<IEncoderFormValues>;
}

export const QRBarcodeField = ({
  control,
}: QRBarcodeFieldProps): ReactElement => {
  const [isRequired, setIsRequired] = useState<boolean>(true);
  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name: 'qrBarCode',
    rules: { required: isRequired },
    defaultValue: '',
  });

  const contractDetails = useWatch({
    control,
    name: ['companyCode', 'contractNumber'],
  });

  useEffect(() => {
    if (!!contractDetails.length) {
      let cc = contractDetails[0];
      let cn = contractDetails[1];
      cc = cc ? cc.replace(/\s/g, '') : '';
      cn = cn ? cn.replace(/\s/g, '') : '';
      setIsRequired(cc === '' && cn === '');
    }
  }, [contractDetails]);

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
