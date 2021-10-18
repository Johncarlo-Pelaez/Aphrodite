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
  const handleShowUploadModal = (show: boolean) => setUploadModalShow(show);
  const handleShowViewDocModal = (show: boolean) => setViewDocModalShow(show);

  return (
    <Container>
      <Stack className="mt-5" direction="horizontal" gap={3}>
        <Button
          className="px-4"
          variant="dark"
          onClick={() => handleShowUploadModal(true)}
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
          onClick={() => handleShowViewDocModal(true)}
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
        onClose={() => handleShowUploadModal(false)}
      />
      <ViewDocModal
        isVisible={viewDocModalShow}
        documentId={selectedDocument?.id}
        onClose={() => handleShowViewDocModal(false)}
      />
    </Container>
  );
};

export default HomePage;
