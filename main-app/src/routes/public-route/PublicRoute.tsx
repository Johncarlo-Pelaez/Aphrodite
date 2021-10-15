import { ReactElement, FunctionComponent } from 'react';
import { Route, RouteProps } from 'react-router-dom';

type PublicRouteProps = RouteProps & {
  layout?: FunctionComponent<any>;
};

export const PublicRoute = (props: PublicRouteProps): ReactElement => {
  const { layout: Layout, ...rest } = props;

  if (!Layout) return <Route {...rest} />;

  return (
    <Layout>
      <Route {...rest} />
    </Layout>
  );
};

export default PublicRoute;
