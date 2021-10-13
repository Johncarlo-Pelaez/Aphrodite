import { ReactElement, useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropZone.module.css';
import { FileInfo, UploadStatus } from '../../';

export interface DropZoneProps {
  setItems: Dispatch<SetStateAction<FileInfo[]>>;
}
export const DropZone = ({ setItems }: DropZoneProps): ReactElement => {
  const renderDropZone = (): ReactElement => (
    <div {...getRootProps({ className: styles.dropzone })}>
      <input {...getInputProps()} accept=".pdf" />
      <p className={styles.drag_message}>
        Click or drag files to this area to upload
      </p>
    </div>
  );

  const onDrop = useCallback(
    (accessFiles: File[]) => {
      const constructFileInfo = accessFiles.map((file): FileInfo => {
        return {
          file,
          percent: 0,
          status: UploadStatus.PENDING,
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
