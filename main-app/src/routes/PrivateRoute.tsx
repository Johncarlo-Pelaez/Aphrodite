import React, { Fragment } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';

interface PrivateRouteProps extends RouteProps {
  layout?: React.FC;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
  const { layout: Layout, ...rest } = props;

  return (
    <Fragment>
      <UnauthenticatedTemplate>
        <Redirect to="/auth" />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        {Layout ? (
          <Layout>
            <Route {...rest} />
          </Layout>
        ) : (
          <Route {...rest} />
        )}
      </AuthenticatedTemplate>
    </Fragment>
  );
};
