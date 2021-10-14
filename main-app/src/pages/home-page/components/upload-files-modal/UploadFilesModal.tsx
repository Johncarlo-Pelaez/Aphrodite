import { ReactElement, useEffect, useState } from 'react';
import { Modal, Button, Stack, ProgressBar } from 'react-bootstrap';
import {
  CancelTokenSource,
  isCanceled,
  cancelRequest,
  createCancelTokenSource,
} from 'apis/request';
import { useUploadDoc } from 'hooks/document';
import { FileItem, DropZone } from './components';
import {
  UploadModalProps,
  FileInfo,
  UploadStatus,
} from './UploadFilesModal.types';
import styles from './UploadFilesModal.module.css';

export const UploadFilesModal = ({
  isVisible,
  onClose,
}: UploadModalProps): ReactElement => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [currentItemNumber, setCurrentItemNumber] = useState<number>(1);
  const totalFiles = files?.length;
  const hasFiles = !!files.length;
  const successCount = hasFiles
    ? files.filter((file) => file.status === UploadStatus.SUCCESS).length
    : 0;
  const forCancel = files.filter(
    ({ status }) =>
      status === UploadStatus.PENDING || status === UploadStatus.UPLOADING,
  ).length;
  const forRetry = files.filter(
    ({ status }) =>
      status === UploadStatus.FAILED || status === UploadStatus.CANCELED,
  ).length;
  const hideRetry =
    !hasFiles || currentItemNumber > 0 || successCount === totalFiles
      ? true
      : false;
  const hideCancel = forCancel <= 0 ? true : false;
  const filesProgress = Math.round((successCount / totalFiles) * 100);

  const { reset: resetUseUploadDoc, mutateAsync: uploadDocument } =
    useUploadDoc();

  const uploadAgain = (itemNumber: number) => {
    if (
      hasFiles &&
      itemNumber > 0 &&
      files.find((file) => file.status === UploadStatus.PENDING)
    ) {
      const currentItemIndex = itemNumber - 1;
      const { file, status, cancelToken } = files[currentItemIndex];
      const nextItemNumber = (itemNumber + 1) % (totalFiles + 1);
      if (status === UploadStatus.SUCCESS || status === UploadStatus.REMOVED)
        setCurrentItemNumber(nextItemNumber);
      else
        uploadFile(file, currentItemIndex, cancelToken, () => {
          if (nextItemNumber <= totalFiles)
            setCurrentItemNumber(nextItemNumber);
        });
    }
  };

  const retryUpload = (itemNumber: number) => {
    const retryItemIndex = itemNumber - 1;
    const itemFile = files[retryItemIndex];
    if (hasFiles && itemNumber > 0 && itemFile) {
      let newFiles = [...files];
      const newCancelToken = createCancelTokenSource();
      const file = newFiles[retryItemIndex].file;
      newFiles[retryItemIndex].status = UploadStatus.PENDING;
      newFiles[retryItemIndex].cancelToken = newCancelToken;
      setFiles(newFiles);
      uploadFile(file, retryItemIndex, newCancelToken);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setCurrentItemNumber(1);
    resetUseUploadDoc();
  };

  const cancelAllUploads = (): void => {
    files.forEach(({ status, percent, cancelToken }) => {
      if (
        status !== UploadStatus.SUCCESS &&
        status !== UploadStatus.REMOVED &&
        percent < 100
      )
        cancelRequest(cancelToken);
    });
  };

  const retryAllCancelledAndError = (): void => {
    setFiles(
      [...files].map((file) => {
        let itemFile = { ...file };
        const { status } = itemFile;
        if (
          status === UploadStatus.FAILED ||
          status === UploadStatus.CANCELED
        ) {
          itemFile.status = UploadStatus.PENDING;
          itemFile.cancelToken = createCancelTokenSource();
        }
        return itemFile;
      }),
    );
    setCurrentItemNumber(1);
  };

  const uploadFile = async (
    file: File,
    index: number,
    cancelToken?: CancelTokenSource,
    onComplete?: () => void,
  ) => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    try {
      await uploadDocument({
        formData,
        onUploadProgress: (percentCompleted): void => {
          let newfiles = [...files];
          newfiles[index].status = UploadStatus.UPLOADING;
          newfiles[index].percent = percentCompleted;
          setFiles(newfiles);
        },
        cancelToken,
      });
      let newfiles = [...files];
      newfiles[index].status = UploadStatus.SUCCESS;
      setFiles(newfiles);
    } catch (ex) {
      let newfiles = [...files];
      let newItemFile = newfiles[index];
      let newStatus: UploadStatus;
      if (isCanceled(ex) && newItemFile.percent < 100)
        newStatus = UploadStatus.CANCELED;
      else newStatus = UploadStatus.FAILED;
      newfiles[index].status = newStatus;
      setFiles(newfiles);
    } finally {
      if (onComplete && typeof onComplete === 'function') onComplete();
    }
  };

  const renderDropZone = (): ReactElement | undefined => {
    if (
      !hasFiles ||
      (hasFiles && !files.find((file) => file.status !== UploadStatus.REMOVED))
    )
      return <DropZone setItems={setFiles} />;
  };

  const renderListItems = (): ReactElement => {
    return (
      <Stack gap={1}>
        {files.map(({ file, percent, status, cancelToken }, index) => {
          return (
            <FileItem
              key={index}
              fileName={file.name}
              progress={percent}
              status={status}
              cancelToken={cancelToken}
              onRetryUpload={() => retryUpload(index + 1)}
            />
          );
        })}
      </Stack>
    );
  };

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
    <Modal
      show={isVisible}
      arial-labelledby="contained-modal-title-vcenter"
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h6" id="contained-modal-title-vcenter">
          Documents Upload
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
          Retry {forRetry}
        </Button>
        <Button
          variant="outline-danger"
          onClick={cancelAllUploads}
          hidden={hideCancel}
        >
          Cancel {forCancel}
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

  useEffect(() => {
    if (hasFiles) uploadAgain(currentItemNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItemNumber, hasFiles]);

  return renderUploadModal();
};

export default UploadFilesModal;
