import { ReactElement, useState, useEffect } from 'react';
import { Modal, Button, ProgressBar } from 'react-bootstrap';
import {
  CancelTokenSource,
  isCanceled,
  cancelRequest,
  createCancelTokenSource,
} from 'apis';
import { useReplaceDocumentFile } from 'hooks';
import { checkIfConflict } from 'utils';
import { FileItem, DropZone } from './components';
import {
  UploadModalProps,
  ReplaceFileInfo,
  UploadStatus,
} from './ReplaceFileModal.types';
import styles from './ReplaceFileModal.module.css';

export const ReplaceFileModal = ({
  documentId,
  isVisible,
  onClose,
}: UploadModalProps): ReactElement => {
  const [itemFile, setItemFile] = useState<ReplaceFileInfo | undefined>(
    undefined,
  );
  const totalFiles = itemFile ? 1 : 0;
  const hasFiles = !!itemFile;
  const successCount =
    hasFiles && itemFile.status === UploadStatus.SUCCESS ? 1 : 0;
  const forCancel =
    (hasFiles && itemFile.status === UploadStatus.PENDING) ||
    itemFile?.status === UploadStatus.UPLOADING
      ? 1
      : 0;
  const hideRetry = !hasFiles || successCount === totalFiles ? true : false;
  const hideCancel = forCancel <= 0 ? true : false;
  const filesProgress = Math.round((successCount / totalFiles) * 100);

  const { reset: resetReplaceDocumentFile, mutateAsync: replaceDocumentFile } =
    useReplaceDocumentFile();

  const retryUpload = () => {
    if (hasFiles && itemFile) {
      const newCancelToken = createCancelTokenSource();
      setItemFile((prevItemFile) => {
        if (prevItemFile) {
          prevItemFile.status = UploadStatus.PENDING;
          prevItemFile.cancelToken = newCancelToken;
        }
        return prevItemFile;
      });
      uploadFile(itemFile.file, newCancelToken);
    }
  };

  const clearFiles = () => {
    setItemFile(undefined);
    resetReplaceDocumentFile();
  };

  const cancelUpload = (): void => {
    if (
      itemFile &&
      itemFile.status !== UploadStatus.SUCCESS &&
      itemFile.status !== UploadStatus.REMOVED &&
      itemFile.percent < 100
    )
      cancelRequest(itemFile.cancelToken);
  };

  const retryAllCancelledAndError = (): void => {
    setItemFile((prevItemFile) => {
      if (
        prevItemFile &&
        (prevItemFile.status === UploadStatus.FAILED ||
          prevItemFile.status === UploadStatus.CANCELED)
      ) {
        prevItemFile.status = UploadStatus.PENDING;
        prevItemFile.cancelToken = createCancelTokenSource();
      }
      return prevItemFile;
    });
  };

  const uploadFile = async (
    file: File,
    cancelToken?: CancelTokenSource,
    onComplete?: () => void,
  ) => {
    try {
      await replaceDocumentFile({
        documentId,
        file,
        onUploadProgress: (percentCompleted): void => {
          setItemFile((prevItemFile) => {
            if (prevItemFile) {
              prevItemFile.status = UploadStatus.UPLOADING;
              prevItemFile.percent = percentCompleted;
            }
            return prevItemFile;
          });
        },
        cancelToken,
      });

      setItemFile((prevItemFile) => {
        if (prevItemFile) {
          prevItemFile.status = UploadStatus.SUCCESS;
          prevItemFile.error = undefined;
        }
        return prevItemFile;
      });
    } catch (ex: any) {
      if (isCanceled(ex) && !!itemFile?.percent && itemFile.percent < 100) {
        setItemFile((prevItemFile) => {
          if (prevItemFile) {
            prevItemFile.status = UploadStatus.CANCELED;
          }
          return prevItemFile;
        });
      } else {
        if (checkIfConflict(ex))
          setItemFile((prevItemFile) => {
            if (prevItemFile) {
              prevItemFile.status = UploadStatus.FAILED;
              prevItemFile.error = 'QR Code or Barcode already exist.';
            }
            return prevItemFile;
          });
        else
          setItemFile((prevItemFile) => {
            if (prevItemFile) {
              prevItemFile.status = UploadStatus.FAILED;
            }
            return prevItemFile;
          });
      }
    } finally {
      if (onComplete && typeof onComplete === 'function') onComplete();
    }
  };

  const renderDropZone = (): ReactElement | undefined => {
    if (!hasFiles) return <DropZone setItem={setItemFile} />;
  };

  const renderListItems = (): ReactElement | undefined =>
    itemFile && (
      <FileItem
        fileName={itemFile.file.name}
        progress={itemFile.percent}
        status={itemFile.status}
        cancelToken={itemFile.cancelToken}
        error={itemFile.error}
        onRetryUpload={retryUpload}
      />
    );

  const renderProgressBar = (): ReactElement | undefined => {
    if (hasFiles)
      return (
        <div>
          <ProgressBar
            variant={filesProgress === 100 ? 'success' : 'info'}
            className="mt-3"
            now={filesProgress}
            label={`${filesProgress}%`}
          />
          <p className="text-end mb-0">{`${successCount} out of ${totalFiles} Completed`}</p>
        </div>
      );
  };

  const renderUploadModal = (): ReactElement => (
    <Modal show={isVisible} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title as="h6">
          <b>REPLACE FILE</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        {renderDropZone()}
        {renderListItems()}
        {renderProgressBar()}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          onClick={retryAllCancelledAndError}
          hidden={hideRetry}
        >
          Retry
        </Button>
        <Button
          variant="outline-danger"
          onClick={cancelUpload}
          hidden={hideCancel}
        >
          Cancel
        </Button>
        <Button variant="outline-dark" onClick={clearFiles} hidden={!hasFiles}>
          Clear
        </Button>
        <Button variant="outline-dark" onClick={onClose}>
          Hide
        </Button>
      </Modal.Footer>
    </Modal>
  );

  useEffect(
    function replaceFile() {
      if (hasFiles && itemFile.status === UploadStatus.PENDING) {
        const { file, cancelToken } = itemFile;
        uploadFile(file, cancelToken);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasFiles, itemFile],
  );

  return renderUploadModal();
};

export default ReplaceFileModal;
