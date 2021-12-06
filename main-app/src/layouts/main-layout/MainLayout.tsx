import { Fragment, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { WithChildren } from 'core/types';
import { useSignOut, useAccount } from 'hooks';
import { MainMenuItems } from './main-layout.config';

type MainLayoutProps = WithChildren<{}>;

export const MainLayout = (props: MainLayoutProps): ReactElement => {
  const { children } = props;
  const history = useHistory();
  const { account } = useAccount();
  const { signOut } = useSignOut();

  const redirect = (path: string): void => {
    history.push(path);
  };

  const redirectToHome = (): void => {
    redirect('/');
  };

  return (
    <Fragment>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand onClick={redirectToHome}>
            <strong>APP LOGO</strong>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav>
              {MainMenuItems.map((mi, index) => (
                <Nav.Link key={index} onClick={() => redirect(mi.path)}>
                  <strong>{mi.label}</strong>
                </Nav.Link>
              ))}
            </Nav>
            <Nav>
              <NavDropdown title={account?.username}>
                <NavDropdown.Item onClick={signOut}>Log out</NavDropdown.Item>
              </NavDropdown>
              <span className="nav-link__avatar">
                <FontAwesomeIcon icon={faUserCircle} size="lg" />
              </span>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <main>{children}</main>
    </Fragment>
  );
};

export default MainLayout;
