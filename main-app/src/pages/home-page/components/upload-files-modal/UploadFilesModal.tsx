import { ReactElement, useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Stack,
  Container,
  Row,
  ProgressBar,
  Card,
  Navbar,
} from 'react-bootstrap';
import { S3Uploader } from '../s3-uploader';
import { FileItem } from './components';
import {
  STARTING_ITEM,
  accessKeyId,
  secretAccessKey,
  S3_BUCKET,
  REGION,
} from 'core/constants';
import styles from './UploadFilesModal.module.css';

import AWS from 'aws-sdk';
import S3 from 'aws-sdk/clients/s3';

AWS.config.update({ accessKeyId, secretAccessKey });

const myBucket = new S3({
  params: { Bucket: S3_BUCKET },
  region: REGION,
});

export interface UploadModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export interface FileInfoProps {
  file: File;
  percent: number;
}

export const UploadFilesModal = ({
  isVisible,
  onClose,
}: UploadModalProps): ReactElement => {
  const [files, setFiles] = useState<FileInfoProps[]>([]);
  const [, setStarted] = useState<boolean>(false);
  const [itemNumber, setItemNumber] = useState<number>(STARTING_ITEM);
  const [filesProgress, setFilesProgress] = useState<number>(0);
  const numberOfFiles = files?.length;

  const uploadFiles = () => {
    setStarted(true);
    uploadAgain(itemNumber);
  };

  const uploadAgain = (itemNumber: number) => {
    if (files) {
      const fileIndex = itemNumber - 1;
      const file = files[fileIndex];
      let nextItem = itemNumber + 1;

      uploadFile(
        file,
        () => {
          if (nextItem <= files.length) {
            uploadAgain(nextItem);
          } else {
            nextItem = STARTING_ITEM;
          }

          if (nextItem === STARTING_ITEM) {
            setStarted(false);
          }

          setItemNumber(nextItem);
        },
        itemNumber,
      );
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setStarted(false);
    setItemNumber(STARTING_ITEM);
    setFilesProgress(0);
  };

  const uploadFile = (
    file: FileInfoProps,
    onComplete: () => void,
    index: number,
  ) => {
    let fileInfo = [...files];
    let idx = index - 1;

    const params = {
      ACL: 'public-read',
      Body: file.file,
      Bucket: S3_BUCKET,
      Key: 'docs/' + file.file.name,
    };

    myBucket
      .putObject(params)
      .on('httpUploadProgress', (evt) => {
        fileInfo[idx].percent = Math.round((evt.loaded / evt.total) * 100);
        setFiles(fileInfo);

        const currentProgress = fileInfo
          .map((item) => item.percent)
          .reduce((prev, next) => prev + next);

        if (numberOfFiles) {
          const onProgress = Math.round(currentProgress / numberOfFiles);
          setFilesProgress(onProgress);
        }
      })
      .on('complete', () => {
        onComplete();
      })
      .send((err) => {
        if (err) console.log(err);
      });
  };

  const renderListItemsComponent = (): ReactElement => {
    let completedCount = 0;

    files.forEach(({ percent }) => {
      if (percent === 100) completedCount++;
    });

    return (
      <Container>
        <Stack gap={1} className={styles.stack_list_file_items}>
          {files.map(({ file, percent }, idx) => {
            return (
              <Card className={styles.card_file_item_list} key={idx}>
                <FileItem fileName={file.name} progress={percent} />
              </Card>
            );
          })}
        </Stack>
        <div className={styles.files_progress__status_file_completed}>
          <Card>
            <ProgressBar
              className={styles.files_progress}
              now={filesProgress}
              label={`${filesProgress}%`}
            />
          </Card>
          <div>
            <Navbar.Text className={styles.text_upload_file_status}>{`${
              files ? completedCount : 0
            } out of ${numberOfFiles} Completed`}</Navbar.Text>
          </div>
        </div>
      </Container>
    );
  };

  const renderUploadComponent = (): ReactElement => {
    return (
      <Container>
        <Row>
          <S3Uploader setItems={setFiles} />
        </Row>
        <Row>{renderListItemsComponent()}</Row>
      </Container>
    );
  };

  const renderUploadModal = (): ReactElement => (
    <Modal
      show={isVisible}
      arial-labelledby="contained-modal-title-vcenter"
      onHide={onClose}
      contentClassName={styles.upload_modal}
    >
      <Modal.Header className={styles.modal_header_s3_upload} closeButton>
        <Modal.Title as="h6" id="contained-modal-title-vcenter">
          Documents Upload
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modal_body}>
        {renderUploadComponent()}
      </Modal.Body>
      <Modal.Footer className={styles.modal_footer_s3_upload}>
        <Button variant="primary" size="sm" onClick={clearFiles}>
          Reset
        </Button>
        <Button variant="primary" size="sm" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  useEffect(() => {
    if (numberOfFiles) {
      uploadFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numberOfFiles]);

  return renderUploadModal();
};
