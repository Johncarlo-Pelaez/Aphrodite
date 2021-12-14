import { ReactElement } from 'react';
import { Card, Container, Tab, Row, Col, Nav } from 'react-bootstrap';
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

export const SettingsPage = (): ReactElement => {
  return (
    <Container className="setting-container" fluid>
      <h5 className="setting-page-header mt-1 fw-bolder position-relative mx-auto flex-wrap flex-column py-3">
        Settings
      </h5>
      <Tab.Container
        id="left-tabs-example"
        defaultActiveKey={TabKey.NOMENCLATURE_LOOKUP}
      >
        <Row>
          <Col sm={2} md={2} className="flex-column flex-wrap p-0 0 0">
            <Nav className="flex-column text-wrap flex-wrap">
              <Card className="flex-wrap flex-column bg-light p-0 card mb-4 border-0">
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
                  <Nav.Link
                    className="nav-link"
                    eventKey={TabKey.USERS_MANAGEMENT}
                  >
                    User
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="nav-link" eventKey={TabKey.ACTIVITY_LOG}>
                    Activity
                  </Nav.Link>
                </Nav.Item>
              </Card>
            </Nav>
          </Col>
          <Col sm={9} md={9} className="p-0 0 0">
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
};

export default SettingsPage;
