import React, { Fragment, useMemo } from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import {
  useEmailAllowed,
  useLoadAccountToken,
  useGetCurrentUserRole,
} from 'hooks';
import { Role } from 'core/enum';

interface PrivateRouteProps extends RouteProps {
  layout?: React.FC;
  allowedUserRoles?: Role[];
}

export const PrivateRoute = (props: PrivateRouteProps) => {
  const { layout: Layout, allowedUserRoles, ...rest } = props;
  const { isAllowed } = useEmailAllowed();
  const { isLoaded } = useLoadAccountToken();
  const currentUserRole = useGetCurrentUserRole();
  const hasAccess = useMemo((): boolean => {
    if (!!allowedUserRoles?.length)
      return allowedUserRoles.some((ar) => ar === currentUserRole);
    return true;
  }, [allowedUserRoles, currentUserRole]);

  if (isLoaded && !isAllowed) {
    return <Redirect to="/forbidden-account" />;
  }

  if (!hasAccess) {
    return <Redirect to="/forbidden" />;
  }

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
