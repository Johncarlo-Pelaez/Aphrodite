import { ReactElement, useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Document } from 'models';
import { useRetryDocuments, useCancelDocuments } from 'hooks';
import { SearchField, DateSelect } from 'core/ui';
import {
  UploadFilesModal,
  DocumentsTable,
  ViewDocModal,
  ProcessDetails,
  StatusDropdown,
  OperationDropdown,
  UserDropdown,
} from './components';
import { OperationOption } from './components/operation-dropdown';
import { StatusOption } from './components/status-dropdown';
import {
  getDocStatusFilter,
  getForRetryDocStatuses,
  getForCancelDocStatuses,
} from './HomePage.utils';

export const HomePage = (): ReactElement => {
  const [searchKey, setSearchKey] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>(
    StatusOption.ALL,
  );
  const [selectedOperation, setSelectedOperation] = useState<OperationOption>(
    OperationOption.ALL,
  );
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const selectedDocumentKeys = selectedDocuments.map((d) => d.id);
  const [uploadModalShow, setUploadModalShow] = useState<boolean>(false);
  const [viewDocModalShow, setViewDocModalShow] = useState<boolean>(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const processDetailsRef = useRef<any>(null);
  const documentsTableRef = useRef<any>(null);
  const hasSelectedRows = !!selectedDocuments.length;
  const selected1Doc =
    selectedDocuments.length === 1 ? selectedDocuments[0] : undefined;
  const hasSelected1Doc = !!selected1Doc;
  const enableRetryButton =
    !!selectedDocuments.length &&
    selectedDocuments.every((doc) =>
      getForRetryDocStatuses().some((s) => s === doc.status),
    );
  const enableCancelButton =
    !!selectedDocuments.length &&
    selectedDocuments.every((doc) =>
      getForCancelDocStatuses().some((s) => s === doc.status),
    );
  const documentStatusFilter = getDocStatusFilter(
    selectedStatus,
    selectedOperation,
  );

  const {
    isLoading: isRetryDocSaving,
    isError: hasRetryDocError,
    mutateAsync: retryDocumentsAsync,
    reset: resetRetryDoc,
  } = useRetryDocuments();

  const {
    isLoading: isCancelDocSaving,
    isError: hasCancelDocError,
    mutateAsync: cancelDocumentsAsync,
    reset: resetCancelDoc,
  } = useCancelDocuments();

  const resetTableSelection = (): void => {
    setSelectedDocuments([]);
  };

  const handleOpen = (): void => {
    if (hasSelected1Doc) setViewDocModalShow(true);
  };

  const handleRetryDocs = async (): Promise<void> => {
    if (!isRetryDocSaving && enableRetryButton) {
      await retryDocumentsAsync(selectedDocumentKeys);
      alert('Success.');
      resetTableSelection();
    }
  };

  const handleCancelDocs = async (): Promise<void> => {
    if (!isCancelDocSaving && enableCancelButton) {
      await cancelDocumentsAsync(selectedDocumentKeys);
      alert('Success.');
      resetTableSelection();
    }
  };

  const refreshDocumentslist = (): void => {
    documentsTableRef.current?.refresh();
    processDetailsRef.current?.refresh();
  };

  const selectNextDocument = (): void => {
    documentsTableRef.current?.next();
    refreshDocumentslist();
  };

  useEffect(() => {
    if (hasRetryDocError) alert('Failed to retry documents.');
    if (hasCancelDocError) alert('Failed to cancel documents.');
  }, [hasRetryDocError, hasCancelDocError]);

  useEffect(() => {
    return function componentCleanUp() {
      resetRetryDoc();
      resetCancelDoc();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="my-4" fluid>
      <div className="d-flex justify-content-between flex-wrap">
        <h4 className="fw-normal py-3">Documents</h4>
        <Stack className="my-2" direction="horizontal" gap={3}>
          <Button
            className="px-4"
            variant="dark"
            onClick={() => setUploadModalShow(true)}
          >
            Upload
          </Button>
          <Button
            className="px-4"
            variant="outline-secondary"
            onClick={refreshDocumentslist}
          >
            Refresh
          </Button>
        </Stack>
      </div>
      <ProcessDetails ref={processDetailsRef} />
      <Stack className="my-2" direction="horizontal" gap={3}>
        <Button
          className="px-4"
          variant="outline-secondary"
          disabled={!hasSelected1Doc}
          onClick={handleOpen}
        >
          Open
        </Button>
        {enableRetryButton && (
          <Button
            className="px-4"
            variant="outline-dark"
            onClick={handleRetryDocs}
            disabled={!hasSelectedRows}
          >
            Retry
          </Button>
        )}
        {enableCancelButton && (
          <Button
            className="px-4"
            variant="outline-dark"
            disabled={!hasSelectedRows}
            onClick={handleCancelDocs}
          >
            Cancel
          </Button>
        )}
      </Stack>
      <Row className="my-2">
        <Col className="mb-2" xs={12} lg={2}>
          <StatusDropdown
            selected={selectedStatus}
            onChange={setSelectedStatus}
          />
        </Col>
        <Col className="mb-2" xs={12} lg={2}>
          <OperationDropdown
            selected={selectedOperation}
            onChange={setSelectedOperation}
          />
        </Col>
        <Col className="mb-2" xs={12} lg={2}>
          <DateSelect
            value={dateFrom}
            onChange={setDateFrom}
            label="Date from"
            floatLabel
          />
        </Col>
        <Col className="mb-2" xs={12} lg={2}>
          <DateSelect
            value={dateTo}
            onChange={setDateTo}
            label="Date to"
            floatLabel
          />
        </Col>
        <Col xs={12} lg={4}>
          <UserDropdown value={username} onChange={setUsername} />
        </Col>
      </Row>
      <div className="d-flex justify-content-end mb-2">
        <SearchField searchKey={searchKey} onSearchDocument={setSearchKey} />
      </div>
      <DocumentsTable
        ref={documentsTableRef}
        selectedDocuments={selectedDocuments}
        dataFilters={{
          searchKey,
          dateFrom,
          dateTo,
          statuses: documentStatusFilter,
          username,
        }}
        setSelectedDocuments={setSelectedDocuments}
        onDoubleClickRow={handleOpen}
      />
      <UploadFilesModal
        isVisible={uploadModalShow}
        onClose={() => setUploadModalShow(false)}
      />
      <ViewDocModal
        isVisible={viewDocModalShow}
        documentId={selected1Doc?.id}
        onClose={() => setViewDocModalShow(false)}
        onFormSubmitted={selectNextDocument}
      />
    </Container>
  );
};

export default HomePage;
