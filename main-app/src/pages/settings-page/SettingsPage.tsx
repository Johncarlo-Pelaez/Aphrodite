import { ReactElement } from 'react';
import Container from 'react-bootstrap/Container';
import { MngNomenclature } from './components';

export const SettingsPage = (): ReactElement => {
  return (
    <Container className="my-4" fluid>
      <h4 className="fw-normal py-3">Settings</h4>
      <MngNomenclature />
    </Container>
  );
};

export default SettingsPage;
