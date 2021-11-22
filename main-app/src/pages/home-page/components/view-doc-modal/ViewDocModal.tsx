import { ReactElement, useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { useDocument } from 'hooks';
import { PdfViewer } from 'core/ui';
import { DocumentStatus } from 'core/enum';
import {
  IndexesForm,
  FileProperties,
  DocHistoryTable,
  EncoderForm,
  CheckerForm,
  AppoverForm,
} from './components';
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
  const encoderFormRef = useRef<any>(null);
  const checkerFormRef = useRef<any>(null);
  const approverFormRef = useRef<any>(null);
  const { isLoading: isDocsLoading, data: document } = useDocument(
    isVisible ? documentId : undefined,
  );

  const renderModal = (): ReactElement => (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={closeModal}
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
                {isDocsLoading ? spinner : renderForm()}
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
      {renderModalFooter()}
    </Modal>
  );

  const spinner: ReactElement = (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <Spinner animation="border" />
    </div>
  );

  const renderForm = (): ReactElement => {
    switch (document?.status) {
      case DocumentStatus.MANUAL_ENCODE:
        return (
          <EncoderForm
            ref={encoderFormRef}
            document={document}
            triggerCloseModal={onClose}
          />
        );
      case DocumentStatus.CHECKING:
        return (
          <CheckerForm
            ref={checkerFormRef}
            document={document}
            triggerCloseModal={onClose}
          />
        );
      case DocumentStatus.APPROVAL:
        return (
          <AppoverForm
            ref={approverFormRef}
            document={document}
            triggerCloseModal={onClose}
          />
        );
      default:
        return <IndexesForm document={document} />;
    }
  };

  const renderModalFooter = (): ReactElement => {
    let formActionButtons: ReactElement[];

    switch (document?.status) {
      case DocumentStatus.MANUAL_ENCODE:
        formActionButtons = [
          <Button key="btn-close" variant="outline-danger" onClick={closeModal}>
            Close
          </Button>,
          <Button
            key="btn-save"
            variant="dark"
            onClick={triggerEncoderFormSubmit}
          >
            Save
          </Button>,
        ];
        break;
      case DocumentStatus.CHECKING:
        formActionButtons = [
          <Button
            key="btn-disapprove"
            variant="outline-danger"
            onClick={triggerCheckerFormSubmitDispprove}
          >
            Disapprove
          </Button>,
          <Button
            key="btn-approve"
            variant="dark"
            onClick={triggerCheckerFormSubmitApprove}
          >
            Approve
          </Button>,
        ];
        break;
      case DocumentStatus.APPROVAL:
        formActionButtons = [
          <Button
            key="btn-disapprove"
            variant="outline-danger"
            onClick={triggerApproverFormSubmitDispprove}
          >
            Disapprove
          </Button>,
          <Button
            key="btn-approve"
            variant="dark"
            onClick={triggerApproverFormSubmitApprove}
          >
            Approve
          </Button>,
        ];
        break;
      default:
        formActionButtons = [
          <Button key="btn-close" variant="outline-danger" onClick={closeModal}>
            Close
          </Button>,
        ];
        break;
    }

    return <Modal.Footer>{formActionButtons}</Modal.Footer>;
  };

  const triggerEncoderFormSubmit = (): void => {
    encoderFormRef.current?.encodeDocument();
  };

  const triggerCheckerFormSubmitApprove = (): void => {
    checkerFormRef.current?.approveDocument();
  };

  const triggerCheckerFormSubmitDispprove = (): void => {
    checkerFormRef.current?.disapproveDocument();
  };

  const triggerApproverFormSubmitApprove = (): void => {
    approverFormRef.current?.approveDocument();
  };

  const triggerApproverFormSubmitDispprove = (): void => {
    approverFormRef.current?.disapproveDocument();
  };

  const closeModal = (): void => {
    onClose();
  };

  return renderModal();
};

export default ViewDocModal;
