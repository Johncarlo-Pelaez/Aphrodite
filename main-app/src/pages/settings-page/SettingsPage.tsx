import { ReactElement } from 'react';
import Container from 'react-bootstrap/Container';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import {
  NomenclatureLookup,
  NomenclatureWhiteList,
  Users,
  ActivityLogs,
} from './components';

enum TabKey {
  NOMENCLATURE_LOOKUP = 'NOMENCLATURE_LOOKUP',
  NOMENCLATURE_WHITELIST = 'NOMENCLATURE_WHITELIST',
  USERS_MANAGEMENT = 'USERS_MANAGEMENT',
  ACTIVITY_LOG = 'ACTIVITY_LOG',
}

export const SettingsPage = (): ReactElement => (
  <Container className="my-4" fluid>
    <h4 className="fw-normal py-3">Settings</h4>
    <Tab.Container
      id="left-tabs-example"
      defaultActiveKey={TabKey.NOMENCLATURE_LOOKUP}
    >
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link
                className="nav-link"
                eventKey={TabKey.NOMENCLATURE_LOOKUP}
              >
                Lookup
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                className="nav-link"
                eventKey={TabKey.NOMENCLATURE_WHITELIST}
              >
                Whitelist
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="nav-link" eventKey={TabKey.USERS_MANAGEMENT}>
                User
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link className="nav-link" eventKey={TabKey.ACTIVITY_LOG}>
                Activity
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content className="tab-content">
            <Tab.Pane eventKey={TabKey.NOMENCLATURE_LOOKUP}>
              <NomenclatureLookup />
            </Tab.Pane>
            <Tab.Pane eventKey={TabKey.NOMENCLATURE_WHITELIST}>
              <NomenclatureWhiteList />
            </Tab.Pane>
            <Tab.Pane eventKey={TabKey.USERS_MANAGEMENT}>
              <Users />
            </Tab.Pane>
            <Tab.Pane eventKey={TabKey.ACTIVITY_LOG}>
              <ActivityLogs />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  </Container>
);

export default SettingsPage;
