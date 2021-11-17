import { ReactElement } from 'react';
import { Control } from 'react-hook-form';
import fileSize from 'filesize';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Document } from 'models';
import styles from './EncodeForm.module.css';
import {
  NomenclatureField,
  QRBarcodeField,
  ContractNumberFiled,
  CompanyCodeField,
  DocumentGroupField,
} from './components';
import { LookupOption } from './components/nomen-clature-field';

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
      <Card.Header className={styles.headerTitle}>
        BARCODE / QR CODE
      </Card.Header>
      <Card.Body>
        <table className={styles.fileInfoTable}>
          <tbody>
            <tr>
              <td>
                <b>Filename:</b>
              </td>
              <td>{document?.documentName}</td>
            </tr>
            <tr>
              <td>
                <b>File Size:</b>
              </td>
              <td>{document && fileSize(document?.documentSize)}</td>
            </tr>
          </tbody>
        </table>
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
