import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Suspense, lazy } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MainLayout, PublicLayout } from 'layouts';
import { AnonymousRoute, PrivateRoute } from 'routes';
import { FullHeightSpinner } from 'core/ui';
import { useLoadAccountToken } from 'hooks';
import { RecoilRoot } from 'recoil';

const HomePage = lazy(() => import('pages/home-page'));
const LoginPage = lazy(() => import('pages/login-page'));
const UsersPage = lazy(() => import('pages/users-page'));
const ReportsPage = lazy(() => import('pages/reports-page'));
const NotFoundPage = lazy(() => import('pages/not-found-page'));
const Forbidden = lazy(() => import('pages/forbidden'));

export interface AppProps {
  msalInstance: IPublicClientApplication;
  queryClient: QueryClient;
}

function App({ msalInstance, queryClient }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <AppContent />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </RecoilRoot>
    </MsalProvider>
  );
}

const AppContent = () => {
  const { isAuthenticatedButTokenNotLoaded } = useLoadAccountToken();

  if (isAuthenticatedButTokenNotLoaded) {
    return <FullHeightSpinner />;
  }

  return (
    <Suspense fallback={<FullHeightSpinner />}>
      <Router>
        <Switch>
          <AnonymousRoute
            exact
            path="/auth"
            layout={PublicLayout}
            component={LoginPage}
          />
          <PrivateRoute
            exact
            path="/"
            layout={MainLayout}
            component={HomePage}
          />
          <PrivateRoute
            exact
            path="/users"
            layout={MainLayout}
            component={UsersPage}
          />
          <PrivateRoute
            exact
            path="/reports"
            layout={MainLayout}
            component={ReportsPage}
          />
          <Route component={NotFoundPage} />
          <Route exact path="/forbidden" component={Forbidden} />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default App;
