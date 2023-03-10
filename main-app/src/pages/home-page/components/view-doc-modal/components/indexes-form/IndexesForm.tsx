import React, { ReactElement } from 'react';
import fileSize from 'filesize';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Document, DocumentType } from 'models';
import styles from './IndexesForm.module.css';

export interface IndexesFormProps {
  document?: Document;
  hideDocumentDate?: boolean;
  hideRemarks?: boolean;
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
  hideDocumentDate = false,
  hideRemarks = false,
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
  ];

  if (!hideDocumentDate) {
    indexes.push({
      label: 'Document Date',
      value: document?.documentDate,
    });
  }

  indexes.push({
    label: 'File Name',
    value: document?.documentName,
  });

  if (!hideRemarks) {
    indexes.push({
      label: 'Remarks',
      value: document?.remarks,
    });
  }

  return (
    <React.Fragment>
      {indexes.map((i, index) => (
        <Form.Group key={index}>
          <Form.Label>
            <b>{i.label}</b>
          </Form.Label>
          <Form.Control
            readOnly
            type="text"
            placeholder={i.label}
            value={i.value ?? ''}
          />
        </Form.Group>
      ))}
    </React.Fragment>
  );
};

export const IndexesForm = ({ document }: IndexesFormProps): ReactElement => (
  <Card>
    <Card.Header className={styles.headerTitle}>INDEXES</Card.Header>
    <Card.Body>
      <FileInfo document={document} />
      <hr />
      <Form className={styles.form}>
        <ReadOnlyIndexFields document={document} />
      </Form>
    </Card.Body>
  </Card>
);

export default IndexesForm;
