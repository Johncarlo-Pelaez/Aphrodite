import { ReactElement, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { useDocument } from 'hooks';
import { PdfViewer } from 'core/ui';
import { Indexes, FileProperties, DocHistoryTable } from './components';
import styles from './ViewDocModal.module.scss';

export interface ViewDocModalProps {
  documentId?: number;
  isVisible: boolean;
  onClose: () => void;
}

enum TabKey {
  File = 'FILE',
  Properties = 'PROPERTIES',
  History = 'HISTORY',
}

export const ViewDocModal = ({
  documentId,
  isVisible,
  onClose,
}: ViewDocModalProps): ReactElement => {
  const [key, setKey] = useState<TabKey>(TabKey.File);
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
          <b>{document?.documentName}</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <Tabs
          activeKey={key}
          onSelect={(k: any) => setKey(k as TabKey)}
          className={styles.viewDocMainTab}
        >
          <Tab eventKey={TabKey.File} title={TabKey.File}>
            <div className={styles.tabContent}>
              <div className={styles.pdfViewerWrapper}>
                <PdfViewer documentId={documentId} />
              </div>
              <div className={styles.indexesCardWrapper}>
                {isLoading ? spinner : <Indexes document={document} />}
              </div>
            </div>
          </Tab>
          <Tab eventKey={TabKey.Properties} title={TabKey.Properties}>
            <div className={styles.tabContent}>
              <FileProperties document={document} />
            </div>
          </Tab>
          <Tab eventKey={TabKey.History} title={TabKey.History}>
            <div className={styles.tabContent}>
              <DocHistoryTable documentId={document?.id} />
            </div>
          </Tab>
        </Tabs>
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
