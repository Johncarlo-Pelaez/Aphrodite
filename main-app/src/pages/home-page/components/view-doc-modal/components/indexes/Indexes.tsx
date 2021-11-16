import { ReactElement } from 'react';
import fileSize from 'filesize';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Document, DocumentType } from 'models';
import styles from './Indexes.module.css';

export interface IndexesProps {
  document?: Document;
}

export const Indexes = ({ document }: IndexesProps): ReactElement => {
  const documentType = document?.documentType
    ? (JSON.parse(document?.documentType ?? '').response[0] as DocumentType)
    : null;

  return (
    <Card>
      <Card.Header className={styles.headerTitle}>INDEXES</Card.Header>
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
          <Form.Group>
            <Form.Label>
              <b>Brand</b>
            </Form.Label>
            <Form.Control
              readOnly
              type="text"
              placeholder="Brand"
              value={documentType?.Brand ?? ''}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Company Code</b>
            </Form.Label>
            <Form.Control
              readOnly
              type="text"
              placeholder="Company Code"
              value={documentType?.CompanyCode ?? ''}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Contract Number</b>
            </Form.Label>
            <Form.Control
              readOnly
              type="text"
              placeholder="Contract Number"
              value={documentType?.ContractNumber ?? ''}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Nomenclature</b>
            </Form.Label>
            <Form.Control
              readOnly
              type="text"
              placeholder="Nomenclature"
              value={documentType?.Nomenclature ?? ''}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Document Group</b>
            </Form.Label>
            <Form.Control
              readOnly
              type="text"
              placeholder="Document Group"
              value={documentType?.DocumentGroup ?? ''}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Account Name</b>
            </Form.Label>
            <Form.Control
              readOnly
              type="text"
              placeholder="Account Name"
              value={documentType?.AccountName ?? ''}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>
              <b>Remarks</b>
            </Form.Label>
            <Form.Control
              readOnly
              as="textarea"
              rows={4}
              type="text"
              placeholder="Remarks"
              value={document?.remarks ?? ''}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Indexes;
