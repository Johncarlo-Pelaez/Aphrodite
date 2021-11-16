import { ReactElement, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { useDocument, useEncodeDocument } from 'hooks';
import { PdfViewer } from 'core/ui';
import { DocumentStatus } from 'core/enum';
import {
  Indexes,
  FileProperties,
  DocHistoryTable,
  EncodeForm,
} from './components';
import styles from './ViewDocModal.module.scss';
import { LookupOption } from './components/encode-form/components/nomen-clature-input';

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
  const [nomenClature, setNomenClature] = useState<LookupOption[]>([]);
  const [qrBarCode, setQrBarCode] = useState<string>('');
  const [companyCode, setCompanyCode] = useState<string>('');
  const [contractNumber, setContractNumber] = useState<string>('');
  const { isLoading: isDocsLoading, data: document } = useDocument(
    isVisible ? documentId : undefined,
  );
  const {
    isLoading: isEncodeDocSaving,
    isError: hasEncodeSaveError,
    mutateAsync: encodeDocumentAsync,
    reset: resetEncodeDocument,
  } = useEncodeDocument();
  const qrCode = document?.qrCode || '';
  const isEncode = document?.status === DocumentStatus.FOR_MANUAL_ENCODE;

  const spinner: ReactElement = (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <Spinner animation="border" />
    </div>
  );

  const renderForm = (): ReactElement => {
    switch (document?.status) {
      case DocumentStatus.FOR_MANUAL_ENCODE:
        return (
          <>
            <Alert variant="danger" show={hasEncodeSaveError}>
              Failed to Encode.
            </Alert>
            <EncodeForm
              document={document}
              qrBarCode={qrBarCode}
              setQRBarCode={setQrBarCode}
              companyCode={companyCode}
              setCompanyCode={setCompanyCode}
              contractNumber={contractNumber}
              setContractNumber={setContractNumber}
              nomenClature={nomenClature}
              setNomenClature={setNomenClature}
            />
          </>
        );
      default:
        return <Indexes document={document} />;
    }
  };

  const encodeSubmit = async (): Promise<void> => {
    if (!documentId) return;

    if (!nomenClature.length || nomenClature.length < 1) {
      alert('Nomenclature is required.');
      return;
    }

    if (
      (!qrBarCode || qrBarCode === '') &&
      (!companyCode ||
        companyCode === '' ||
        !contractNumber ||
        contractNumber === '')
    ) {
      alert(
        'QR/ Barcode and Company code & Contract number cannot be both empty. Please provide value for either QR/ Barcode or Company Code & Contract Number.',
      );
      return;
    }

    const { label, documentGroup } = nomenClature[0];

    if (!isEncodeDocSaving) {
      await encodeDocumentAsync({
        documentId,
        qrCode: qrBarCode,
        companyCode,
        contractNumber,
        nomenClature: label,
        documentGroup: documentGroup ?? '',
      });
      alert('Encode Saved.');
      closeModal();
    }
  };

  const closeModal = (): void => {
    resetEncodeDocument();
    onClose();
  };

  useEffect(() => {
    setQrBarCode(qrCode);
  }, [qrCode]);

  return (
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
      <Modal.Footer>
        <Button variant="outline-danger" onClick={closeModal}>
          Close
        </Button>
        <Button hidden={!isEncode} variant="dark" onClick={encodeSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDocModal;
