import {
  ReactElement,
  useImperativeHandle,
  forwardRef,
  useEffect,
  Fragment,
} from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import { Document } from 'models';
import { useApproverDocoment } from 'hooks';
import { FileInfo, ReadOnlyIndexFields } from '../indexes-form';
import styles from './AppoverForm.module.css';

export interface AppoverFormProps {
  document?: Document;
  onSubmitted: () => void;
}

export const AppoverForm = forwardRef(
  (props: AppoverFormProps, ref): ReactElement => {
    const { document, onSubmitted: triggerSubmitted } = props;
    const {
      isLoading: isApproveDocSaving,
      isError: hasApproveDocError,
      mutateAsync: approveDocumentAsync,
      reset,
    } = useApproverDocoment();

    const approveDocumentSubmit = async (
      approve: boolean = true,
    ): Promise<void> => {
      if (!document) {
        alert('Please select a document.');
        return;
      }

      if (!isApproveDocSaving) {
        if (approve) {
          await approveDocumentAsync({
            documentId: document?.id as number,
          });
          alert('Approve Saved.');
        } else {
          await approveDocumentAsync({
            documentId: document?.id as number,
            approve: false,
          });
          alert('Disapprove Saved.');
        }

        triggerSubmitted();
      }
    };

    const approveDocument = () => {
      approveDocumentSubmit();
    };

    const disapproveDocument = () => {
      approveDocumentSubmit(false);
    };

    useImperativeHandle(ref, () => ({
      approveDocument,
      disapproveDocument,
    }));

    useEffect(() => {
      return function componentCleanUp() {
        reset();
      };
      // eslint-disable-next-line
    }, []);

    return (
      <Fragment>
        <Alert variant="danger" show={hasApproveDocError}>
          Failed to save.
        </Alert>
        <Card>
          <Card.Header className="text-center">INDEXES</Card.Header>
          <Card.Body>
            <FileInfo document={document} />
            <hr />
            <Form className={styles.form}>
              <ReadOnlyIndexFields document={document} />
              <Form.Group className="mb-3">
                <Form.Label>
                  <b>Document Date</b>
                </Form.Label>
                <Form.Control
                  readOnly
                  type="date"
                  value={document?.documentDate ?? ''}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  <b>Remarks</b>
                </Form.Label>
                <Form.Control
                  readOnly
                  placeholder="Remarks"
                  value={document?.remarks ?? ''}
                />
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
      </Fragment>
    );
  },
);

export default AppoverForm;
