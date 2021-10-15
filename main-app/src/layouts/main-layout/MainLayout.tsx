import { Fragment, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { WithChildren } from 'core/types';
import { useSignOut, useGetCurrentSignInUserName } from 'hooks/auth';
import { getMainMenuItems } from './main-layout.config';

type MainLayoutProps = WithChildren<{}>;

export const MainLayout = (props: MainLayoutProps): ReactElement => {
  const { children } = props;
  const history = useHistory();
  const username = useGetCurrentSignInUserName();
  const { signOutAsync } = useSignOut();

  const redirect = (path: string): void => {
    history.push(path);
  };

  const redirectToHome = (): void => {
    redirect('/');
  };

  return (
    <Fragment>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand onClick={redirectToHome}>Amicassa</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {getMainMenuItems().map((mi, index) => (
                <Nav.Link key={index} onClick={() => redirect(mi.path)}>
                  {mi.label}
                </Nav.Link>
              ))}
            </Nav>
            <Nav>
              <Navbar.Text>Signed in as: </Navbar.Text>
              <NavDropdown
                id="nav-dropdown-dark-example"
                title={username}
                menuVariant="dark"
              >
                <NavDropdown.Item>Account</NavDropdown.Item>
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
