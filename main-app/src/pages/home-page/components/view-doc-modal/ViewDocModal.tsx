import { ReactElement } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useDocument } from 'hooks';
import { PdfViewer } from 'core/ui';
import { ViewDocModalProps } from './ViewDocModal.types';
import { Indexes } from './components';
import styles from './ViewDocModal.module.scss';

export const ViewDocModal = ({
  documentId,
  isVisible,
  onClose,
}: ViewDocModalProps): ReactElement => {
  const { isLoading, data: document } = useDocument(
    isVisible ? documentId : undefined,
  );

  const spinner: ReactElement = (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <Spinner animation="border" />
    </div>
  );

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={onClose}
      centered
      dialogClassName={styles.viewModal}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h6">
          <b>VIEW DOCUMENT</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <div className={styles.pdfViewerWrapper}>
          <PdfViewer documentId={documentId} />
        </div>
        <div className={styles.indexesCardWrapper}>
          {isLoading ? spinner : <Indexes document={document} />}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDocModal;
