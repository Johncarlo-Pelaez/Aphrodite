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
  const indexes: { label: string; value?: string | number }[] = [
    {
      label: 'Barcode / QR code',
      value: document?.qrCode,
    },
    {
      label: 'Brand',
      value: documentType?.Brand,
    },
    {
      label: 'Company Code',
      value: documentType?.CompanyCode,
    },
    {
      label: 'Contract Number',
      value: documentType?.ContractNumber,
    },
    {
      label: 'Account Name',
      value: documentType?.AccountName,
    },
    {
      label: 'Customer Code',
      value: documentType?.CustomerCode,
    },
    {
      label: 'Project Name',
      value: documentType?.ProjectName,
    },
    {
      label: 'Unit Details',
      value: documentType?.UnitDetails,
    },
    {
      label: 'Project Code',
      value: documentType?.ProjectCode,
    },
    {
      label: 'Nomenclature',
      value: documentType?.Nomenclature,
    },
    {
      label: 'Document Group',
      value: documentType?.DocumentGroup,
    },
    {
      label: 'Transmittal Form ID',
      value: documentType?.Transmittal,
    },
    {
      label: 'Number of Pages',
      value: document?.pageTotal,
    },
    {
      label: 'Document Date',
      value: document?.documentDate,
    },
    {
      label: 'File Name',
      value: document?.documentName,
    },
    {
      label: 'Remarks',
      value: document?.remarks,
    },
  ];

  const renderField = (
    label: string,
    value?: string | number,
  ): ReactElement => (
    <Form.Group>
      <Form.Label>
        <b>{label}</b>
      </Form.Label>
      <Form.Control
        readOnly
        type="text"
        placeholder={label}
        value={value ?? ''}
      />
    </Form.Group>
  );

  return (
    <React.Fragment>
      {indexes.map((i) => renderField(i.label, i.value))}
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
