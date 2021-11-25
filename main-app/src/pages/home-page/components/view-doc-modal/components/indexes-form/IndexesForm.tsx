import React, { ReactElement } from 'react';
import fileSize from 'filesize';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Document, DocumentType } from 'models';
import styles from './IndexesForm.module.css';

export interface IndexesFormProps {
  document?: Document;
}

export const FileInfo = ({ document }: IndexesFormProps): ReactElement => (
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
);

export const parseDocumentType = (
  strDocumentType: string,
): DocumentType | null => {
  return strDocumentType && strDocumentType !== ''
    ? (JSON.parse(strDocumentType).response[0] as DocumentType)
    : null;
};

export const ReadOnlyIndexFields = ({
  document,
}: IndexesFormProps): ReactElement => {
  const documentType = parseDocumentType(document?.documentType ?? '');
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export const IndexesForm = ({ document }: IndexesFormProps): ReactElement => (
  <Card>
    <Card.Header className={styles.headerTitle}>INDEXES</Card.Header>
    <Card.Body>
      <FileInfo document={document} />
      <hr />
      <Form>
        <ReadOnlyIndexFields document={document} />
      </Form>
    </Card.Body>
  </Card>
);

export default IndexesForm;
