import { ReactElement, FunctionComponent } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';

type ProtectedRouteProps = RouteProps & {
  layout?: FunctionComponent<any>;
};

export const ProtectedRoute = (props: ProtectedRouteProps): ReactElement => {
  const { layout: Layout, ...rest } = props;

  const authenticated = (
    <AuthenticatedTemplate>
      <Route {...rest} />;
    </AuthenticatedTemplate>
  );

  if (!Layout) return authenticated;

  return (
    <Layout>
      <UnauthenticatedTemplate>
        <Redirect to="/auth" />
      </UnauthenticatedTemplate>
      {authenticated}
    </Layout>
  );
};

export default ProtectedRoute;
