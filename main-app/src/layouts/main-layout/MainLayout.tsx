import { Fragment, ReactElement } from 'react';
import { useMsal } from '@azure/msal-react';
import Button from 'react-bootstrap/Button';
import { WithChildren } from 'core/types';
import { getMainMenuItems } from './main-layout.config';

type MainLayoutProps = WithChildren<{}>;

export const MainLayout = (props: MainLayoutProps): ReactElement => {
  const { children } = props;
  const { instance, accounts } = useMsal();
  return (
    <Fragment>
      <header>
        {getMainMenuItems().map((mi, index) => (
          <h1 key={index}>{mi.label}</h1>
        ))}
        <h5>{accounts[0]?.name}</h5>
        <h5>{accounts[0]?.username}</h5>
        <Button variant="link" onClick={(e) => instance.logoutPopup()}>
          Log Out
        </Button>
      </header>
      <div>{children}</div>
    </Fragment>
  );
};

export default MainLayout;
