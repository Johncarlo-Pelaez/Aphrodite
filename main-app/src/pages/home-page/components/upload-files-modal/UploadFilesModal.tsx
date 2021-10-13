import { ReactElement, useEffect, useState } from 'react';
import { Modal, Button, Stack, ProgressBar } from 'react-bootstrap';
import { useUploadDoc } from 'hooks/document';
import { FileItem, DropZone } from './components';
import {
  UploadModalProps,
  FileInfo,
  UploadStatus,
} from './UploadFilesModal.types';

export const UploadFilesModal = ({
  isVisible,
  onClose,
}: UploadModalProps): ReactElement => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState<number>(0);
  const [filesProgress, setFilesProgress] = useState<number>(0);
  const numberOfFiles = files?.length;
  const hasFiles = !!files.length;
  const { reset: resetUseUploadDoc, mutateAsync: uploadDocument } =
    useUploadDoc();

  const uploadAgain = (itemIndex: number) => {
    if (
      hasFiles &&
      itemIndex >= 0 &&
      files.find((file) => file.status === UploadStatus.PENDING)
    ) {
      const { file, status } = files[itemIndex];
      const nextItemIndex = (itemIndex + 1) % numberOfFiles;
      if (status === UploadStatus.SUCCESS || status === UploadStatus.REMOVED)
        setCurrentItemIndex(nextItemIndex);
      else
        uploadFile(
          file,
          () => {
            if (nextItemIndex < numberOfFiles)
              setCurrentItemIndex(nextItemIndex);
          },
          itemIndex,
        );
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setCurrentItemIndex(1);
    setFilesProgress(0);
    resetUseUploadDoc();
  };

  const uploadFile = async (
    file: File,
    onComplete: () => void,
    index: number,
  ) => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    try {
      await uploadDocument({
        formData,
        onUploadProgress: (percentCompleted): void => {
          let newfiles = [...files];
          newfiles[index].percent = percentCompleted;
          setFiles(newfiles);
          const currentProgress = newfiles
            .map((item) => item.percent)
            .reduce((prev, next) => prev + next);
          const totalProgress = Math.round(currentProgress / numberOfFiles);
          setFilesProgress(totalProgress);
        },
      });
      let newfiles = [...files];
      newfiles[index].status = UploadStatus.SUCCESS;
      setFiles(newfiles);
    } catch (ex) {
      let newfiles = [...files];
      newfiles[index].status = UploadStatus.FAILED;
      setFiles(newfiles);
    } finally {
      onComplete();
    }
  };

  const renderDropZone = (): ReactElement | undefined => {
    if (
      !hasFiles ||
      (hasFiles && !files.find((file) => file.status !== UploadStatus.REMOVED))
    )
      return <DropZone setItems={setFiles} />;
  };

  const renderListItemsComponent = (): ReactElement => {
    return (
      <Stack gap={1}>
        {files.map(({ file, percent, status }, index) => {
          return (
            <FileItem
              key={index}
              fileName={file.name}
              progress={percent}
              size={file.size}
              status={status}
            />
          );
        })}
      </Stack>
    );
  };

  const getCompletedCount = (): number => {
    return hasFiles
      ? files.filter((file) => file.status === UploadStatus.SUCCESS).length
      : 0;
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
          <p className="text-end mb-0">{`${getCompletedCount()} out of ${numberOfFiles} Completed`}</p>
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
      <Modal.Body>
        {renderDropZone()}
        {renderListItemsComponent()}
        {renderProgressBar()}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={clearFiles}>
          Clear
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Hide
        </Button>
      </Modal.Footer>
    </Modal>
  );

  useEffect(() => {
    if (hasFiles) uploadAgain(currentItemIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentItemIndex, hasFiles]);

  return renderUploadModal();
};

export default UploadFilesModal;
