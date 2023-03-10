import { Fragment, ReactElement } from 'react';
import { useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { WithChildren, MenuItem } from 'core/types';
import { Role } from 'core/enum';
import { useSignOut, useAccount, useGetCurrentUser } from 'hooks';

type MainLayoutProps = WithChildren<{}>;

export const MainLayout = (props: MainLayoutProps): ReactElement => {
  const { children } = props;
  const history = useHistory();
  const { account } = useAccount();
  const { signOut } = useSignOut();
  const { data: user } = useGetCurrentUser();
  const MainMenuItems: MenuItem[] = [
    {
      label: 'Home',
      path: '/',
    },
    {
      label: 'Reports',
      path: '/reports',
    },
    {
      label: 'Settings',
      path: '/settings',
      hidden: user?.role !== Role.ADMIN,
    },
  ];

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
            <img
              alt=""
              src="/logo.png"
              width="200px"
              height="30px"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse>
            <Nav>
              {MainMenuItems.map((mi, index) => (
                <Nav.Link
                  hidden={mi.hidden}
                  key={index}
                  onClick={() => redirect(mi.path)}
                >
                  <strong>{mi.label}</strong>
                </Nav.Link>
              ))}
            </Nav>
            <Nav>
              <NavDropdown title={`${account?.username} (${user?.role})`}>
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
