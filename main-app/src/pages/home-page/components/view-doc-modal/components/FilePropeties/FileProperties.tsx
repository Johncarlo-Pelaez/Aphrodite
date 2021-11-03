import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import fileSize from 'filesize';
import { Document } from 'models';

export interface FilePropertiesProps {
  document?: Document;
}

export const FileProperties = ({
  document,
}: FilePropertiesProps): ReactElement => {
  return (
    <Form>
      <Form.Group>
        <Form.Label>
          <b>Filename</b>
        </Form.Label>
        <Form.Control
          readOnly
          type="text"
          placeholder="Brand"
          value={document?.documentName ?? ''}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <b>File Size</b>
        </Form.Label>
        <Form.Control
          readOnly
          type="text"
          placeholder="Company Code"
          value={document ? fileSize(document?.documentSize) : ''}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>
          <b>Barcode / QR Code</b>
        </Form.Label>
        <Form.Control
          readOnly
          type="text"
          placeholder="Barcode / QR Code"
          value={document?.qrCode ?? ''}
        />
      </Form.Group>
    </Form>
  );
};

export default FileProperties;
