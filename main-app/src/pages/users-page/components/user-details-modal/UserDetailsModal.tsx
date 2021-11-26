import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { User } from 'models';

export interface UserDetailsModalProps {
  user: User | undefined;
  isVisible: boolean;
  onClose: () => void;
}

export const UserDetailsModal = ({
  user,
  isVisible,
  onClose,
}: UserDetailsModalProps): ReactElement => {
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
            <b>USER DETAILS</b>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User View Identifier</Form.Label>
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
export default UserDetailsModal;
