import React from 'react';
import { Route, RouteProps } from 'react-router-dom';

interface PublicRouteProps extends RouteProps {
  layout?: React.FC;
}

export const PublicRoute = (props: PublicRouteProps) => {
  const { layout: Layout, ...rest } = props;

  if (!Layout) return <Route {...rest} />;

  return (
    <Layout>
      <Route {...rest} />
    </Layout>
  );
};
