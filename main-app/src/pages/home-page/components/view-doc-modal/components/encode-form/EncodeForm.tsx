import { ReactElement } from 'react';
import fileSize from 'filesize';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Document } from 'models';
import styles from './EncodeForm.module.css';
import { NomenClatureInput } from './components';
import { LookupOption } from './components/nomen-clature-input';

export interface EncodeFormProps {
  document?: Document;
  qrBarCode: string;
  setQRBarCode: (value: string) => void;
  companyCode: string;
  setCompanyCode: (value: string) => void;
  contractNumber: string;
  setContractNumber: (value: string) => void;
  nomenClature: LookupOption[];
  setNomenClature: (selected: LookupOption[]) => void;
}

export const EncodeForm = (props: EncodeFormProps): ReactElement => {
  const {
    document,
    qrBarCode,
    setQRBarCode,
    companyCode,
    setCompanyCode,
    contractNumber,
    setContractNumber,
    nomenClature,
    setNomenClature,
  } = props;

  const documentGroup =
    !!nomenClature.length && nomenClature.length > 0
      ? nomenClature[0].documentGroup
      : '';

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
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Barcode / QR Code</b>
            </Form.Label>
            <Form.Control
              name="qrBarCode"
              placeholder="Barcode / QR Code"
              onChange={(event) => setQRBarCode(event.target.value)}
              value={qrBarCode}
            />
          </Form.Group>
          <h6 className="text-center">OR</h6>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Company Code</b>
            </Form.Label>
            <Form.Control
              name="companyCode"
              placeholder="Company Code"
              onChange={(event) => setCompanyCode(event.target.value)}
              value={companyCode}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Contract Number</b>
            </Form.Label>
            <Form.Control
              name="contractNumber"
              placeholder="Contract Number"
              onChange={(event) => setContractNumber(event.target.value)}
              value={contractNumber}
            />
          </Form.Group>
          <NomenClatureInput value={nomenClature} onChange={setNomenClature} />
          <Form.Group className="mb-3">
            <Form.Label>
              <b>Document Group</b>
            </Form.Label>
            <Form.Control
              readOnly
              name="documentGroup"
              placeholder="Document Group"
              value={documentGroup || ''}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EncodeForm;
