import { ReactElement, useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { createCancelTokenSource } from 'apis/request';
import styles from './DropZone.module.css';
import { FileInfo, UploadStatus } from '../../';

export interface DropZoneProps {
  setItems: Dispatch<SetStateAction<FileInfo[]>>;
}
export const DropZone = ({ setItems }: DropZoneProps): ReactElement => {
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
      const constructFileInfo = accessFiles.map((file): FileInfo => {
        return {
          file,
          percent: 0,
          status: UploadStatus.PENDING,
          cancelToken: createCancelTokenSource(),
        };
      });
      setItems(constructFileInfo);
    },
    [setItems],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    acceptFiles: '.pdf',
  });

  return renderDropZone();
};

export default DropZone;
