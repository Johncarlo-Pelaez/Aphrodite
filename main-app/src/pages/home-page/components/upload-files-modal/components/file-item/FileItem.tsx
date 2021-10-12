import { ReactElement } from 'react';
import { ProgressBar, Container, Navbar, Stack } from 'react-bootstrap';
import styles from './FileItem.module.css';

interface FileItemProps {
  fileName: string;
  progress: number;
}

export const FileItem = ({
  fileName,
  progress,
}: FileItemProps): ReactElement => {
  return (
    <Navbar className={styles.navbar_list_upload_file}>
      <Container className={styles.navbar_list_upload_file_container}>
        <Stack gap={0}>
          <Navbar.Text className={styles.navbar_list_upload_filename}>
            {fileName.split('.').slice(0, -1).join('.')}
          </Navbar.Text>
          <ProgressBar
            className={styles.navbar_list_upload_progress}
            now={progress}
            label={`${progress}%`}
          />
        </Stack>
      </Container>
    </Navbar>
  );
};
