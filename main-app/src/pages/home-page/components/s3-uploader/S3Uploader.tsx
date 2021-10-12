import { ReactElement, useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container, Card } from 'react-bootstrap';
import styles from './S3Uploader.module.css';
import { FileInfoProps } from '../upload-files-modal';

export interface S3UploaderProps {
  setItems: Dispatch<SetStateAction<FileInfoProps[]>>;
}
export const S3Uploader = ({ setItems }: S3UploaderProps): ReactElement => {
  const renderS3Upload = (): ReactElement => (
    <Container>
      <Card>
        <Card.Header as="h6">S3 Bucket</Card.Header>
        <Card.Body>
          <div {...getRootProps({ className: styles.dropzone })}>
            <input {...getInputProps()} accept=".pdf" />

            <p className={styles.drag_message}>
              Drag 'n' drop some files here, or click to select files
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );

  const onDrop = useCallback(
    (accessFiles: File[]) => {
      const getFiles = accessFiles.map((file) => ({
        file,
      }));

      const constructFileInfo = getFiles.map(({ file }) => {
        const item = {
          file,
          percent: 0,
        };
        return item;
      });

      setItems((current) => [...current, ...constructFileInfo]);
    },
    [setItems],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    acceptFiles: '.pdf',
  });

  return renderS3Upload();
};
