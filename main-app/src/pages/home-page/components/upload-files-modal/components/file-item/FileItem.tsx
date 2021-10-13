import { ReactElement } from 'react';
import { ProgressBar, Stack, Card } from 'react-bootstrap';
import fileSize from 'filesize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import styles from './FileItem.module.css';
import { UploadStatus } from '../../';

export interface FileItemProps {
  fileName: string;
  size: number;
  progress: number;
  status: UploadStatus;
}

export const FileItem = ({
  fileName,
  progress,
  size,
  status,
}: FileItemProps): ReactElement => {
  const getProgressVariant = (): string => {
    switch (status) {
      case UploadStatus.FAILED:
        return 'danger';
      case UploadStatus.SUCCESS:
        return 'success';
      default:
        return '';
    }
  };

  return (
    <Card>
      <div className="d-flex align-items-center p-2 shadow-sm ">
        <FontAwesomeIcon size="lg" icon={faFilePdf} />
        <Stack className="ms-2" gap={0}>
          <span>{fileName}</span>
          <ProgressBar
            variant={getProgressVariant()}
            now={progress}
            label={`${progress}%`}
            className={styles.itemProgresBar}
          />
          <span className={styles.itemFileSizeText}>{fileSize(size)}</span>
        </Stack>
      </div>
    </Card>
  );
};
