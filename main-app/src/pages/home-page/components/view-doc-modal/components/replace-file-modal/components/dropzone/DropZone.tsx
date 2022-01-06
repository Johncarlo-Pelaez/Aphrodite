import { ReactElement, useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { createCancelTokenSource } from 'apis';
import styles from './DropZone.module.css';
import { ReplaceFileInfo, UploadStatus } from '../..';

export interface DropZoneProps {
  setItem: Dispatch<SetStateAction<ReplaceFileInfo | undefined>>;
}
export const DropZone = ({ setItem }: DropZoneProps): ReactElement => {
  const renderDropZone = (): ReactElement => (
    <div {...getRootProps({ className: styles.dropzone })}>
      <input {...getInputProps()} accept=".pdf" />
      <div className="d-flex flex-column justify-content-center">
        <div className="mb-2">
          <FontAwesomeIcon size="2x" icon={faUpload} />
        </div>
        <p className={styles.drag_message}>
          Click or drag files to this area to upload
        </p>
      </div>
    </div>
  );

  const onDrop = useCallback(
    (accessFiles: File[]) => {
      if (!!accessFiles?.length)
        setItem({
          file: accessFiles[0],
          percent: 0,
          status: UploadStatus.PENDING,
          cancelToken: createCancelTokenSource(),
        });
    },
    [setItem],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    acceptFiles: '.pdf',
    maxFiles: 1,
  });

  return renderDropZone();
};

export default DropZone;
