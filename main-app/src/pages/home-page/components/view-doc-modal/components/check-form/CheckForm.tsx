import { ReactElement } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Document } from 'models';
import { FileInfo, ReadOnlyIndexFields } from '../indexes-form';

export interface CheckFormProps {
  document?: Document;
}

export const CheckForm = ({ document }: CheckFormProps): ReactElement => {
  return (
    <Card>
      <Card.Header className="text-center">INDEXES</Card.Header>
      <Card.Body>
        <FileInfo document={document} />
        <hr />
        <Form>
          <ReadOnlyIndexFields document={document} />
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

export default CheckForm;
