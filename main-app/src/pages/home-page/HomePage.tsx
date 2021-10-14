import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { UploadFilesModal, DocumentsTable } from './components';

export const HomePage = () => {
  const [uploadModalShow, setUploadModalShow] = useState(false);
  const handleShow = (show: boolean) => setUploadModalShow(show);

  return (
    <Container>
      <Button
        className="mt-5"
        variant="outline-dark"
        onClick={() => handleShow(true)}
      >
        Upload
      </Button>
      <DocumentsTable />
      <UploadFilesModal
        isVisible={uploadModalShow}
        onClose={() => handleShow(false)}
      />
    </Container>
  );
};

export default HomePage;
