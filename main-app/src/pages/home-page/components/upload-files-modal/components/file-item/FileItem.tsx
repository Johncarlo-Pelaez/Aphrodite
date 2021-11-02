import { ReactElement } from 'react';
import { ProgressBar, Stack, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTimes, faRedo } from '@fortawesome/free-solid-svg-icons';
import { CancelTokenSource, cancelRequest } from 'apis';
import styles from './FileItem.module.css';
import { UploadStatus } from '../../';

export interface FileItemProps {
  fileName: string;
  progress: number;
  status: UploadStatus;
  cancelToken?: CancelTokenSource;
  onRetryUpload: () => void;
}

export const FileItem = ({
  fileName,
  progress,
  status,
  cancelToken,
  onRetryUpload: triggerOnRetryUpload,
}: FileItemProps): ReactElement => {
  const isCancelVisible =
    status === UploadStatus.PENDING ||
    status === UploadStatus.UPLOADING ||
    status === UploadStatus.SUCCESS;
  const isRetryVisible =
    status === UploadStatus.FAILED || status === UploadStatus.CANCELED;

  const getStatusText = (): string => {
    switch (status) {
      case UploadStatus.FAILED:
        return 'Error';
      case UploadStatus.SUCCESS:
        return 'Success';
      case UploadStatus.CANCELED:
        return 'Cancelled';
      case UploadStatus.PENDING:
        return 'Waiting';
      case UploadStatus.UPLOADING:
        return 'Uploading';
      default:
        return '';
    }
  };

  const getProgressVariant = (): string => {
    switch (status) {
      case UploadStatus.FAILED:
        return 'danger';
      case UploadStatus.SUCCESS:
        return 'success';
      case UploadStatus.CANCELED:
        return 'warning';
      default:
        return '';
    }
  };

  const getButtonClassName = (): string => {
    if (status === UploadStatus.SUCCESS) return styles.itemButtonDisabled;
    else return styles.itemButtonEnabled;
  };

  const cancelUpload = (): void => {
    if (progress < 100) cancelRequest(cancelToken);
  };

  return (
    <Card>
      <div className="d-flex align-items-center p-2 shadow-sm ">
        <FontAwesomeIcon size="lg" icon={faFilePdf} />
        <Stack className="mx-2" gap={0}>
          <span className={styles.itemFileNameText}>{fileName}</span>
          <ProgressBar
            variant={getProgressVariant()}
            now={progress}
            className={styles.itemProgresBar}
          />
          <span className={styles.itemFileStatusText}>{getStatusText()}</span>
        </Stack>
        <span
          className={getButtonClassName()}
          style={{ display: isCancelVisible ? 'block' : 'none' }}
          onClick={cancelUpload}
        >
          <FontAwesomeIcon size="lg" icon={faTimes} />
        </span>
        <span
          className={getButtonClassName()}
          style={{ display: isRetryVisible ? 'block' : 'none' }}
          onClick={triggerOnRetryUpload}
        >
          <FontAwesomeIcon size="sm" icon={faRedo} />
        </span>
      </div>
    </Card>
  );
};
