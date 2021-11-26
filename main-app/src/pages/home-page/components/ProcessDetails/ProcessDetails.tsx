import { ReactElement } from 'react';
import Card from 'react-bootstrap/Card';
import { useDocumentsProcessCount } from 'hooks';
import { DocumentStatus } from 'core/enum';

interface UseDocsProcessDetailsResult {
  success: number;
  processing_waiting: number;
  cancelled_error: number;
}

const useDocsProcessDetails = (): UseDocsProcessDetailsResult => {
  const { data: success = 0 } = useDocumentsProcessCount({
    statuses: [DocumentStatus.MIGRATE_DONE],
  });
  const { data: processing_waiting = 0 } = useDocumentsProcessCount({
    statuses: Object.values(DocumentStatus).filter(
      (s) =>
        s !== DocumentStatus.MIGRATE_DONE &&
        s !== DocumentStatus.MIGRATE_FAILED &&
        s !== DocumentStatus.CANCELLED,
    ),
  });
  const { data: cancelled_error = 0 } = useDocumentsProcessCount({
    statuses: [DocumentStatus.MIGRATE_FAILED, DocumentStatus.CANCELLED],
  });

  return {
    success,
    processing_waiting,
    cancelled_error,
  };
};

export interface ProcessDetailsProps {
  onRetryDocuments: (documentIds: number) => void;
}

export const ProcessDetails = (): ReactElement => {
  const { success, processing_waiting, cancelled_error } =
    useDocsProcessDetails();

  return (
    <div className="d-flex justify-content-center my-4">
      <Card
        className="shadow-sm mx-3"
        style={{ width: '20rem', border: '0px' }}
      >
        <Card.Body>
          <Card.Title as="h6">Success</Card.Title>
          <Card.Text className="text-center p-3 fs-4">{success}</Card.Text>
        </Card.Body>
      </Card>
      <Card
        className="shadow-sm mx-3"
        style={{ width: '20rem', border: '0px' }}
      >
        <Card.Body>
          <Card.Title as="h6">Proccessing / Waiting</Card.Title>
          <Card.Text className="text-center p-3 fs-4">
            {processing_waiting}
          </Card.Text>
        </Card.Body>
      </Card>
      <Card
        className="shadow-sm mx-3"
        style={{ width: '20rem', border: '0px' }}
      >
        <Card.Body>
          <Card.Title as="h6">Cancelled / Error</Card.Title>
          <Card.Text className="text-center p-3 fs-4">
            {cancelled_error}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProcessDetails;
