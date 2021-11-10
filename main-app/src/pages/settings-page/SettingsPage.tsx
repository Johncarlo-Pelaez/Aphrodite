import { ReactElement } from 'react';
import Container from 'react-bootstrap/Container';
import { MngNomenClature } from './components';

export const SettingsPage = (): ReactElement => {
  return (
    <Container className="my-4">
      <h4 className="fw-normal py-3">Settings</h4>
      <MngNomenClature />
    </Container>
  );
};

export default SettingsPage;
