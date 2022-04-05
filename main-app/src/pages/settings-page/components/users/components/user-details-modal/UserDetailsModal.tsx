import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import moment from 'moment';
import { User } from 'models';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import styles from './UserDetailsModal.module.css';

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
          <table className={styles.table}>
            <tbody>
              <tr>
                <td>
                  <strong>Email</strong>
                </td>
                <td>{user?.username}</td>
              </tr>
              <tr>
                <td>
                  <strong>Role</strong>
                </td>
                <td>{user?.role}</td>
              </tr>
              <tr>
                <td>
                  <strong>First Name</strong>
                </td>
                <td>{user?.firstName}</td>
              </tr>
              <tr>
                <td>
                  <strong>Last Name</strong>
                </td>
                <td>{user?.lastName}</td>
              </tr>
              <tr>
                <td>
                  <strong>Date Created</strong>
                </td>
                <td>{moment(user?.createdDate).format(DEFAULT_DATE_FORMAT)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Status</strong>
                </td>
                <td>
                  <Badge pill bg={user?.isActive ? 'success' : 'danger'}>
                    {user?.isActive ? 'Active' : 'Deactivated'}
                  </Badge>
                </td>
              </tr>
            </tbody>
          </table>
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
