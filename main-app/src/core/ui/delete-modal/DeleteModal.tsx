import { ReactElement, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export interface DeleteModalProps {
  title: string;
  isVisible: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export const DeleteModal = (props: DeleteModalProps): ReactElement => {
  const {
    title,
    isVisible,
    onDelete: triggerDelete,
    onClose: triggerClose,
  } = props;

  const [error, setError] = useState<string | undefined>(undefined);
  const [value, setValue] = useState<string>('');

  const handleDelete = (): void => {
    if (value !== title) {
      setError('Not match!');
      return;
    }

    triggerDelete();
  };

  return (
    <Modal backdrop="static" show={isVisible} onHide={triggerClose} centered>
      <Modal.Header closeButton>
        <Modal.Title as="h6">
          <b>DELETE</b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Please enter "{title}" to delete.</Form.Label>
          <Form.Control
            isInvalid={!!error}
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-danger" onClick={handleDelete}>
          Delete
        </Button>
        <Button variant="secondary" onClick={triggerClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
