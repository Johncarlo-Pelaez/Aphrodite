import { ReactElement } from 'react';
import { Control } from 'react-hook-form';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Document } from 'models';
import {
  NomenclatureField,
  QRBarcodeField,
  ContractNumberFiled,
  CompanyCodeField,
  DocumentGroupField,
} from './components';
import { LookupOption } from './components/nomen-clature-field';
import { FileInfo } from '../indexes-form';

export interface EncodeFormProps {
  document?: Document;
  control: Control<IEncodeFormValues>;
}

export interface IEncodeFormValues {
  qrBarCode: string;
  companyCode: string;
  contractNumber: string;
  nomenclature: LookupOption[];
  documentGroup: string;
}

export const EncodeForm = ({
  document,
  control,
}: EncodeFormProps): ReactElement => {
  return (
    <Card>
      <Card.Header className="text-center">BARCODE / QR CODE</Card.Header>
      <Card.Body>
        <FileInfo document={document} />
        <hr />
        <Form>
          <QRBarcodeField control={control} />
          <h6 className="text-center">OR</h6>
          <CompanyCodeField control={control} />
          <ContractNumberFiled control={control} />
          <NomenclatureField control={control} />
          <DocumentGroupField control={control} />
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EncodeForm;
