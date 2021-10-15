import { ReactElement } from 'react';
import Spinner from 'react-bootstrap/Spinner';

export const FullWidthSpinner = (): ReactElement => (
  <div className="d-flex vh-100 justify-content-center align-items-center">
    <Spinner animation="border" />
  </div>
);
