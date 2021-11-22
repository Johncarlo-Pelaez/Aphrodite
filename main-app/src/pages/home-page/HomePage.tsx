import { ReactElement, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { Document } from 'models';
import {
  UploadFilesModal,
  DocumentsTable,
  ViewDocModal,
  ProcessDetails,
} from './components';

export const HomePage = (): ReactElement => {
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [uploadModalShow, setUploadModalShow] = useState<boolean>(false);
  const [viewDocModalShow, setViewDocModalShow] = useState<boolean>(false);
  const hasSelectedRows = !!selectedDocuments.length;
  const selected1Doc =
    selectedDocuments.length === 1 ? selectedDocuments[0] : undefined;
  const hasSelected1Doc = !!selected1Doc;

  return (
    <Container className="my-4">
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
          <Button className="px-4" variant="outline-dark">
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
        <Button
          className="px-4"
          variant="outline-dark"
          disabled={!hasSelectedRows}
        >
          Retry
        </Button>
        <Button className="px-4" variant="danger" disabled={!hasSelectedRows}>
          Delete
        </Button>
      </Stack>
      <DocumentsTable
        selectedDocuments={selectedDocuments}
        setSelectedDocuments={setSelectedDocuments}
      />
      <UploadFilesModal
        isVisible={uploadModalShow}
        onClose={() => setUploadModalShow(false)}
      />
      <ViewDocModal
        isVisible={viewDocModalShow}
        documentId={selected1Doc?.id}
        onClose={() => setViewDocModalShow(false)}
      />
    </Container>
  );
};

export default HomePage;
