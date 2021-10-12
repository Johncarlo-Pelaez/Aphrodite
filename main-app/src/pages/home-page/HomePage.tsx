import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { UploadFilesModal } from './components';

export const HomePage = () => {
  const [modalShow, setModalShow] = useState(false);
  const handleShow = () => setModalShow(true);

  return (
    <Container>
      <div className="homepage">
        <Button className="mt-5" variant="primary" onClick={handleShow}>
          New
        </Button>
        <UploadFilesModal
          isVisible={modalShow}
          onClose={() => setModalShow(false)}
        />
      </div>
    </Container>
  );
};
