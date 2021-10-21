import { useState } from 'react';
import { Container, Button, Stack } from 'react-bootstrap';
import { Document } from 'models';
import { UploadFilesModal, DocumentsTable, ViewDocModal } from './components';

export const HomePage = () => {
  const [selectedDocument, setSelectedDocument] = useState<
    Document | undefined
  >(undefined);
  const [uploadModalShow, setUploadModalShow] = useState<boolean>(false);
  const [viewDocModalShow, setViewDocModalShow] = useState<boolean>(false);

  return (
    <Container className="my-4">
      <h4 className="fw-normal py-3">Upload List</h4>
      <Stack className="my-2" direction="horizontal" gap={3}>
        <Button
          className="px-4"
          variant="dark"
          onClick={() => setUploadModalShow(true)}
        >
          Upload
        </Button>
        <Button className="px-4" variant="secondary">
          Filters
        </Button>
        <Button
          className="px-4"
          variant="light"
          disabled={!selectedDocument}
          onClick={() => setViewDocModalShow(true)}
        >
          View
        </Button>
        <Button className="px-4" variant="outline-dark">
          Retry
        </Button>
        <Button className="px-4" variant="danger">
          Delete
        </Button>
      </Stack>
      <DocumentsTable
        selectedDoc={selectedDocument}
        onSelectDoc={setSelectedDocument}
      />
      <UploadFilesModal
        isVisible={uploadModalShow}
        onClose={() => setUploadModalShow(false)}
      />
      <ViewDocModal
        isVisible={viewDocModalShow}
        documentId={selectedDocument?.id}
        onClose={() => setViewDocModalShow(false)}
      />
    </Container>
  );
};

export default HomePage;
