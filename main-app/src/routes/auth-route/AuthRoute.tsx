import { ReactElement, FunctionComponent } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';

type AuthRouteProps = RouteProps & {
  layout?: FunctionComponent<any>;
};

export const AuthRoute = (props: AuthRouteProps): ReactElement => {
  const { layout: Layout, ...rest } = props;
  const unAuthenticated = (
    <UnauthenticatedTemplate>
      <Route {...rest} />;
    </UnauthenticatedTemplate>
  );

  if (!Layout) return unAuthenticated;

  return (
    <Layout>
      <AuthenticatedTemplate>
        <Redirect to="/" />
      </AuthenticatedTemplate>
      {unAuthenticated}
    </Layout>
  );
};

export default AuthRoute;
