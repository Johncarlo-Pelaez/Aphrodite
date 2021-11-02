import React, { Fragment } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';

interface AnonymousRouteProps extends RouteProps {
  layout?: React.FC;
}

export const AnonymousRoute = (props: AnonymousRouteProps) => {
  const { layout: Layout, ...rest } = props;

  return (
    <Fragment>
      <AuthenticatedTemplate>
        <Redirect to="/" />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        {Layout ? (
          <Layout>
            <Route {...rest} />
          </Layout>
        ) : (
          <Route {...rest} />
        )}
      </UnauthenticatedTemplate>
    </Fragment>
  );
};
