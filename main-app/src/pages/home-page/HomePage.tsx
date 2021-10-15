import { useState } from 'react';
import { Container, Button, Stack } from 'react-bootstrap';
import { UploadFilesModal, DocumentsTable } from './components';

export const HomePage = () => {
  const [uploadModalShow, setUploadModalShow] = useState(false);
  const handleShow = (show: boolean) => setUploadModalShow(show);

  return (
    <Container>
      <Stack className="mt-5" direction="horizontal" gap={3}>
        <Button
          className="px-4"
          variant="dark"
          onClick={() => handleShow(true)}
        >
          Upload
        </Button>
        <Button className="px-4" variant="secondary">
          Filters
        </Button>
        <Button className="px-4" variant="light">
          View
        </Button>
        <Button className="px-4" variant="outline-dark">
          Retry
        </Button>
        <Button className="px-4" variant="danger">
          Delete
        </Button>
      </Stack>
      <DocumentsTable />
      <UploadFilesModal
        isVisible={uploadModalShow}
        onClose={() => handleShow(false)}
      />
    </Container>
  );
};

export default HomePage;
