import {
  ReactElement,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import {
  useDocumentsProcessCount,
  useCancelWaitingDocuments,
  useRetryErrorDocuments,
} from 'hooks';
import { DocumentStatus } from 'core/enum';
import {
  getForRetryDocStatuses,
  getForCancelDocStatuses,
} from '../../HomePage.utils';

interface UseDocsProcessDetailsResult {
  success: number;
  processing_waiting: number;
  cancelled_error: number;
  refresh: () => void;
}

const useDocsProcessDetails = (): UseDocsProcessDetailsResult => {
  const { data: success = 0, refetch: refreshMigratedCount } =
    useDocumentsProcessCount({
      statuses: [DocumentStatus.MIGRATE_DONE],
    });
  const { data: processing_waiting = 0, refetch: refreshWaitingCount } =
    useDocumentsProcessCount({
      statuses: getForCancelDocStatuses(),
    });
  const { data: cancelled_error = 0, refetch: refreshErrorCount } =
    useDocumentsProcessCount({
      statuses: getForRetryDocStatuses(),
    });

  return {
    success,
    processing_waiting,
    cancelled_error,
    refresh: (): void => {
      refreshMigratedCount();
      refreshWaitingCount();
      refreshErrorCount();
    },
  };
};

const cardStyle = { width: '20rem', border: '0px' };

export interface ProcessDetailsProps {
  onRetryDocuments: (documentIds: number) => void;
}

export const ProcessDetails = forwardRef(
  (props: unknown, ref): ReactElement => {
    const { success, processing_waiting, cancelled_error, refresh } =
      useDocsProcessDetails();

    const {
      isLoading: isCancelling,
      isError: hasCancelError,
      mutateAsync: cancelWaitingDocuments,
    } = useCancelWaitingDocuments();

    const {
      isLoading: isRetrying,
      isError: hasRetryError,
      mutateAsync: retryWaitingDocuments,
    } = useRetryErrorDocuments();

    const handleCancel = async (): Promise<void> => {
      if (!isCancelling) {
        await cancelWaitingDocuments(null);
        refresh();
      }
    };

    const handleRetry = async (): Promise<void> => {
      if (!isRetrying) {
        await retryWaitingDocuments(null);
        refresh();
      }
    };

    useEffect(() => {
      if (hasRetryError) alert('Failed to retry documents.');
      if (hasCancelError) alert('Failed to cancel documents.');
    }, [hasCancelError, hasRetryError]);

    useImperativeHandle(
      ref,
      () => ({
        refresh,
      }),
      [refresh],
    );

    return (
      <div className="d-flex justify-content-center flex-wrap my-1">
        <Card className="shadow m-3" style={cardStyle}>
          <Card.Body>
            <Card.Title as="h6">Success</Card.Title>
            <Card.Text className="text-center p-3 fs-4">{success}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="shadow m-3" style={cardStyle}>
          <Card.Body>
            <Card.Title as="h6">Processing / Waiting</Card.Title>
            <Card.Text className="text-center p-3 fs-4">
              {processing_waiting}
            </Card.Text>
            <div className="d-flex justify-content-center">
              <Button
                disabled={processing_waiting === 0}
                variant="outline-dark"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </Card.Body>
        </Card>
        <Card className="shadow m-3" style={cardStyle}>
          <Card.Body>
            <Card.Title as="h6">Cancelled / Error</Card.Title>
            <Card.Text className="text-center p-3 fs-4">
              {cancelled_error}
            </Card.Text>
            <div className="d-flex justify-content-center">
              <Button
                disabled={cancelled_error === 0}
                variant="outline-dark"
                onClick={handleRetry}
              >
                Retry
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  },
);

export default ProcessDetails;
