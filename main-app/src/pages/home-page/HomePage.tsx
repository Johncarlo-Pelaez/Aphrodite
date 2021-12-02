import { ReactElement, useState, useRef, useMemo, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { Document } from 'models';
import { useRetryDocs, useCancelDocs } from 'hooks';
import { DocumentStatus } from 'core/enum';
import {
  UploadFilesModal,
  DocumentsTable,
  ViewDocModal,
  ProcessDetails,
  StatusDropdown,
  OperationDropdown,
} from './components';
import { OperationOption } from './components/operation-dropdown';
import { StatusOption } from './components/status-dropdown';
import { concatDocumentStatuses } from './HomePage.utils';

export const HomePage = (): ReactElement => {
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>(
    StatusOption.ALL,
  );
  const [selectedOperation, setSelectedOperation] = useState<OperationOption>(
    OperationOption.ALL,
  );
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [selectedDocumentKeys, setSelectedDocumentKeys] = useState<number[]>(
    [],
  );
  const [uploadModalShow, setUploadModalShow] = useState<boolean>(false);
  const [viewDocModalShow, setViewDocModalShow] = useState<boolean>(false);
  const documentsTableRef = useRef<any>(null);
  const hasSelectedRows = !!selectedDocuments.length;
  const selected1Doc =
    selectedDocuments.length === 1 ? selectedDocuments[0] : undefined;
  const hasSelected1Doc = !!selected1Doc;
  const allOperation = Object.values(OperationOption).filter(
    (o) => o !== OperationOption.ALL,
  );
  const allStatus = Object.values(StatusOption).filter(
    (s) => s !== StatusOption.ALL,
  );
  const enableRetryButton = useMemo(
    () =>
      !!selectedDocuments.length &&
      selectedDocuments.every((doc) =>
        getForRetryDocstatus().some((s) => s === doc.status),
      ),
    [selectedDocuments],
  );
  const enableCancelButton = useMemo(
    () =>
      !!selectedDocuments.length &&
      selectedDocuments.every((doc) =>
        getForCancelDocStatus().some((s) => s === doc.status),
      ),
    [selectedDocuments],
  );

  const {
    isLoading: isRetryDocSaving,
    isError: hasRetryDocError,
    mutateAsync: retryDocumentsAsync,
    reset: resetRetryDoc,
  } = useRetryDocs();

  const {
    isLoading: isCancelDocSaving,
    isError: hasCancelDocError,
    mutateAsync: cancelDocumentsAsync,
    reset: resetCancelDoc,
  } = useCancelDocs();

  const getForRetryDocstatus = (): DocumentStatus[] => {
    return Object.values(DocumentStatus).filter((s) => {
      const arrStattmp = s.split('_');
      if (arrStattmp.length === 2) return arrStattmp[1] === 'FAILED';
      else return false;
    });
  };

  const getForCancelDocStatus = (): DocumentStatus[] => {
    return Object.values(DocumentStatus).filter((s) => {
      const arrStattmp = s.split('_');
      if (arrStattmp.length === 2)
        return arrStattmp[1] !== 'DONE' && arrStattmp[1] !== 'FAILED';
      else return arrStattmp[0] !== 'CANCELLED';
    });
  };

  const handleRetryDocs = async (): Promise<void> => {
    if (!isRetryDocSaving && enableRetryButton) {
      await retryDocumentsAsync(selectedDocumentKeys);
      alert('Success.');
    }
  };

  const handleCancelDocs = async (): Promise<void> => {
    if (!isCancelDocSaving && enableCancelButton) {
      await cancelDocumentsAsync(selectedDocumentKeys);
      alert('Success.');
    }
  };

  const getDocStatusFilter = (
    cmbStatusValue: string,
    cmbOperationValue: string,
  ): DocumentStatus[] => {
    let strStatusesFilter = '';

    if (cmbOperationValue === 'ALL' && cmbStatusValue === 'ALL') {
      strStatusesFilter = Object.values(DocumentStatus).join(',');
    } else if (cmbOperationValue === 'ALL' && cmbStatusValue !== 'ALL') {
      for (const operation of allOperation) {
        strStatusesFilter += concatDocumentStatuses(operation, cmbStatusValue);
      }
    } else if (cmbOperationValue !== 'ALL' && cmbStatusValue === 'ALL') {
      for (const status of allStatus) {
        strStatusesFilter += concatDocumentStatuses(cmbOperationValue, status);
      }
    } else {
      strStatusesFilter = concatDocumentStatuses(
        cmbOperationValue,
        cmbStatusValue,
      );
    }

    const statusesFilter = strStatusesFilter
      .split(',')
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((status) => status.trim()) as DocumentStatus[];

    return !!statusesFilter.length ? statusesFilter : [];
  };

  const refreshDocumentslist = (): void => {
    documentsTableRef.current?.refresh();
  };

  const selectNextDocument = (): void => {
    documentsTableRef.current?.next();
  };

  const docStatusFilter = useMemo(
    () => getDocStatusFilter(selectedStatus, selectedOperation),
    // eslint-disable-next-line
    [selectedStatus, selectedOperation],
  );

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
      <div className="d-flex justify-content-between">
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
            variant="outline-dark"
            onClick={refreshDocumentslist}
          >
            Refresh
          </Button>
        </Stack>
      </div>
      <ProcessDetails />
      <Stack className="my-2" direction="horizontal" gap={3}>
        <Button
          className="px-4"
          variant="outline-secondary"
          disabled={!hasSelected1Doc}
          onClick={() => setViewDocModalShow(true)}
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
      <Stack className="my-2" direction="horizontal" gap={3}>
        <StatusDropdown
          selected={selectedStatus}
          onChange={setSelectedStatus}
        />
        <OperationDropdown
          selected={selectedOperation}
          onChange={setSelectedOperation}
        />
      </Stack>
      <DocumentsTable
        ref={documentsTableRef}
        filterDocStatus={docStatusFilter}
        selectedDocuments={selectedDocuments}
        selectedDocumentKeys={selectedDocumentKeys}
        setSelectedDocuments={setSelectedDocuments}
        setSelectedDocumentKeys={setSelectedDocumentKeys}
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
