import { Fragment, ReactElement } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { WithChildren } from 'core/types';
import { useSignOut } from 'hooks/auth';
import { getMainMenuItems } from './main-layout.config';

type MainLayoutProps = WithChildren<{}>;

export const MainLayout = (props: MainLayoutProps): ReactElement => {
  const { children } = props;
  const { signOutAsync } = useSignOut();
  return (
    <Fragment>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Amicassa</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {getMainMenuItems().map((mi, index) => (
                <Nav.Link key={index} href="#home">
                  {mi.label}
                </Nav.Link>
              ))}
            </Nav>
            <Nav>
              <Navbar.Text>Signed in as: </Navbar.Text>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="Mark Otto "
                menuVariant="dark"
              >
                <NavDropdown.Item>Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={signOutAsync}>
                  Log out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {children}
    </Fragment>
  );
};

export default MainLayout;
