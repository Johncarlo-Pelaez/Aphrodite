import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { User } from 'models';

export interface UserDeleteModalProps {
  user: User | undefined;
  isVisible: boolean;
  onClose: () => void;
}

export const DeleteUserModal = ({
  user,
  isVisible,
  onClose,
}: UserDeleteModalProps): ReactElement => {
  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isVisible}
      onHide={onClose}
      centered
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title as="h6">
            <b>DELETE USER</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User Delete Identifier</Form.Label>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-danger" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default DeleteUserModal;
