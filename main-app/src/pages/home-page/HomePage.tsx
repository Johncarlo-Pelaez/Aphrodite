import { ReactElement, useState, useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Document } from 'models';
import {
  useRetryDocuments,
  useCancelDocuments,
  useDeleteDocumentsFile,
} from 'hooks';
import { SearchField, DateSelect } from 'core/ui';
import {
  UploadFilesModal,
  DocumentsTable,
  ViewDocModal,
  ProcessDetails,
  StatusDropdown,
  UserOption,
  OperationDropdown,
  UserDropdown,
} from './components';
import { OperationOption } from './components/operation-dropdown';
import { StatusOption } from './components/status-dropdown';
import {
  getDocStatusFilter,
  getForRetryDocStatuses,
  getForCancelDocStatuses,
  getForDeleteDocsFileStatuses,
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
  const [selectedUserFilter, setSelectedUserFilter] = useState<
    UserOption | undefined
  >(undefined);
  const processDetailsRef = useRef<any>(null);
  const documentsTableRef = useRef<any>(null);
  const hasSelectedRows = !!selectedDocuments.length;
  const selected1Doc =
    selectedDocuments.length === 1 ? selectedDocuments[0] : undefined;
  const hasSelected1Doc = !!selected1Doc;
  const showRetryButton =
    !!selectedDocuments.length &&
    selectedDocuments.every((doc) =>
      getForRetryDocStatuses().some((s) => s === doc.status),
    );
  const showCancelButton =
    !!selectedDocuments.length &&
    selectedDocuments.every((doc) =>
      getForCancelDocStatuses().some((s) => s === doc.status),
    );
  const showDeleteButton =
    !!selectedDocuments.length &&
    selectedDocuments.every((doc) =>
      getForDeleteDocsFileStatuses().some((s) => s === doc.status),
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

  const {
    isLoading: isDeleteDocsFileSaving,
    isError: hasDeleteDocsFileError,
    mutateAsync: deleteDocumentsFileAsync,
    reset: resetDeleteDocsFile,
  } = useDeleteDocumentsFile();

  const resetTableSelection = (): void => {
    setSelectedDocuments([]);
  };

  const handleOpen = (): void => {
    if (hasSelected1Doc) setViewDocModalShow(true);
  };

  const handleRetryDocs = async (): Promise<void> => {
    if (!isRetryDocSaving && showRetryButton) {
      await retryDocumentsAsync(selectedDocumentKeys);
      alert('Success.');
      resetTableSelection();
    }
  };

  const handleCancelDocs = async (): Promise<void> => {
    if (!isCancelDocSaving && showCancelButton) {
      await cancelDocumentsAsync(selectedDocumentKeys);
      alert('Success.');
      resetTableSelection();
    }
  };

  const handleDeleteDocFile = async (documentId: number): Promise<void> => {
    if (!isDeleteDocsFileSaving) {
      await deleteDocumentsFileAsync([documentId]);
      alert('Success.');
    }
  };

  const handleDeleteDocsFile = async (): Promise<void> => {
    if (!hasSelectedRows) {
      alert('No documents selected.');
      return;
    }

    if (
      !window.confirm('Are you sure you want to delete selected document(s)?')
    )
      return;

    if (!isDeleteDocsFileSaving && showDeleteButton) {
      await deleteDocumentsFileAsync(selectedDocumentKeys);
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
    if (hasDeleteDocsFileError) alert('Failed to delete documents file.');
  }, [hasRetryDocError, hasCancelDocError, hasDeleteDocsFileError]);

  useEffect(() => {
    return function componentCleanUp() {
      resetRetryDoc();
      resetCancelDoc();
      resetDeleteDocsFile();
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
        {showRetryButton && (
          <Button
            className="px-4"
            variant="outline-dark"
            onClick={handleRetryDocs}
            disabled={!hasSelectedRows}
          >
            Retry
          </Button>
        )}
        {showCancelButton && (
          <Button
            className="px-4"
            variant="outline-dark"
            disabled={!hasSelectedRows}
            onClick={handleCancelDocs}
          >
            Cancel
          </Button>
        )}
        {showDeleteButton && (
          <Button
            className="px-4"
            variant="outline-danger"
            disabled={!hasSelectedRows}
            onClick={handleDeleteDocsFile}
          >
            Delete
          </Button>
        )}
      </Stack>
      <Row className="my-2">
        <Col className="mb-2" xs={12} lg={2}>
          <StatusDropdown
            selectedOperation={selectedOperation}
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
            label="From:"
            horizontal
          />
        </Col>
        <Col className="mb-2" xs={12} lg={2}>
          <DateSelect
            value={dateTo}
            onChange={setDateTo}
            label="To:"
            horizontal
          />
        </Col>
        <Col xs={12} lg={4}>
          <UserDropdown
            value={selectedUserFilter}
            onChange={setSelectedUserFilter}
          />
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
          username: selectedUserFilter?.username,
        }}
        setSelectedDocuments={setSelectedDocuments}
        onDoubleClickRow={handleOpen}
      />
      <UploadFilesModal
        isVisible={uploadModalShow}
        onClose={() => setUploadModalShow(false)}
      />
      {hasSelected1Doc && (
        <ViewDocModal
          isVisible={viewDocModalShow && hasSelected1Doc}
          documentId={selected1Doc?.id}
          onClose={() => setViewDocModalShow(false)}
          onFormSubmitted={selectNextDocument}
          onDeleteFileAsync={handleDeleteDocFile}
        />
      )}
    </Container>
  );
};

export default HomePage;
