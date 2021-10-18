import { ReactElement } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ViewDocModalProps } from './ViewDocModal.types';
import { PdfViewer } from './components';
import styles from './ViewDocModal.module.css';

export const ViewDocModal = ({
  documentId,
  isVisible,
  onClose,
}: ViewDocModalProps): ReactElement => {
  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={onClose}
      centered
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>View Document</Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <PdfViewer documentId={documentId} />
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
