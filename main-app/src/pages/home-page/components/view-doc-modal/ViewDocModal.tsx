import { ReactElement, useState, useRef, Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { useDocument, useGetCurrentUser } from 'hooks';
import { PdfViewer } from 'core/ui';
import { DocumentStatus, Role } from 'core/enum';
import {
  IndexesForm,
  FileProperties,
  DocHistoryTable,
  EncoderForm,
  CheckerForm,
  AppoverForm,
  ReplaceFileModal,
} from './components';
import styles from './ViewDocModal.module.scss';

export interface ViewDocModalProps {
  documentId: number;
  isVisible: boolean;
  onClose: () => void;
  onFormSubmitted: () => void;
  onDeleteFileAsync: (documentId: number) => Promise<void>;
}

enum TabKey {
  File = 'FILE',
  Properties = 'PROPERTIES',
  History = 'HISTORY',
}

export const ViewDocModal = (props: ViewDocModalProps): ReactElement => {
  const {
    documentId,
    isVisible,
    onClose: triggerClose,
    onFormSubmitted: triggerFormSubmitted,
    onDeleteFileAsync: triggerDeleteFileAsync,
  } = props;
  const [key, setKey] = useState<TabKey>(TabKey.File);
  const [replaceFileModalShow, setReplaceFileModalShow] =
    useState<boolean>(false);
  const encoderFormRef = useRef<any>(null);
  const checkerFormRef = useRef<any>(null);
  const approverFormRef = useRef<any>(null);
  const { isLoading: isDocsLoading, data: document } = useDocument(
    isVisible ? documentId : undefined,
  );
  const { data: user } = useGetCurrentUser();
  const currentUserRole = user?.role;

  const renderModal = (): ReactElement => (
    <Fragment>
      <ReplaceFileModal
        documentId={documentId}
        isVisible={replaceFileModalShow}
        onClose={() => setReplaceFileModalShow(false)}
      />
      <Modal
        backdrop="static"
        show={isVisible}
        onHide={triggerClose}
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
    </Fragment>
  );

  const spinner: ReactElement = (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <Spinner animation="border" />
    </div>
  );

  const renderForm = (): ReactElement => {
    const documentStatus = document?.status;
    if (documentStatus === DocumentStatus.ENCODING) {
      return (
        <EncoderForm
          ref={encoderFormRef}
          document={document}
          onSubmitted={triggerFormSubmitted}
        />
      );
    } else if (documentStatus === DocumentStatus.CHECKING) {
      return (
        <CheckerForm
          ref={checkerFormRef}
          document={document}
          onSubmitted={triggerFormSubmitted}
        />
      );
    } else if (
      documentStatus === DocumentStatus.CHECKING_DISAPPROVED &&
      (currentUserRole === Role.REVIEWER || currentUserRole === Role.ADMIN)
    ) {
      return (
        <AppoverForm
          ref={approverFormRef}
          document={document}
          onSubmitted={triggerFormSubmitted}
        />
      );
    } else {
      return <IndexesForm document={document} />;
    }
  };

  const renderModalFooter = (): ReactElement => {
    let formActionButtons: ReactElement[];

    const documentStatus = document?.status;
    if (documentStatus === DocumentStatus.ENCODING) {
      formActionButtons = [
        <Button key="btn-close" variant="outline-danger" onClick={triggerClose}>
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
    } else if (documentStatus === DocumentStatus.CHECKING) {
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
    } else if (
      documentStatus === DocumentStatus.CHECKING_DISAPPROVED &&
      (currentUserRole === Role.REVIEWER || currentUserRole === Role.ADMIN)
    ) {
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
    } else if (
      documentStatus === DocumentStatus.DISAPPROVED &&
      (currentUserRole === Role.REVIEWER || currentUserRole === Role.ADMIN)
    ) {
      formActionButtons = [
        <Button
          disabled={document?.isFileDeleted}
          key="btn-delete-file"
          variant="outline-danger"
          onClick={handleDeleteFile}
        >
          Delete File
        </Button>,
        <Button
          key="btn-replace-file"
          variant="dark"
          onClick={() => setReplaceFileModalShow(true)}
        >
          Replace File
        </Button>,
      ];
    } else {
      formActionButtons = [
        <Button key="btn-close" variant="outline-danger" onClick={triggerClose}>
          Close
        </Button>,
      ];
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

  const handleDeleteFile = async (): Promise<void> => {
    if (!document) {
      alert('No document selected.');
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${document?.documentName}`,
      )
    )
      return;

    await triggerDeleteFileAsync(documentId);
    triggerFormSubmitted();
  };

  return renderModal();
};

export default ViewDocModal;
