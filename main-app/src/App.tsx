import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Suspense, lazy } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { MainLayout, PublicLayout } from 'layouts';
import { AnonymousRoute, PrivateRoute } from 'routes';
import { FullHeightSpinner } from 'core/ui';
import { Role } from 'core/enum';
import { useLoadAccountToken } from 'hooks';
import { RecoilRoot } from 'recoil';
import { ForbiddenAccount } from 'pages';
import { CustomNavigationClient } from 'utils';

const HomePage = lazy(() => import('pages/home-page'));
const LoginPage = lazy(() => import('pages/login-page'));
const ReportsPage = lazy(() => import('pages/reports-page'));
const SettingsPage = lazy(() => import('pages/settings-page'));
const NotFoundPage = lazy(() => import('pages/not-found-page'));
const Forbidden = lazy(() => import('pages/forbidden'));
const RootUserPage = lazy(() => import('pages/root-user-page'));

export interface AppProps {
  msalInstance: IPublicClientApplication;
  queryClient: QueryClient;
}

function App({ msalInstance, queryClient }: AppProps) {
  const history = useHistory();
  const navigationClient = new CustomNavigationClient(history);
  msalInstance.setNavigationClient(navigationClient);

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
          <AnonymousRoute
            exact
            path="/auth/root"
            layout={PublicLayout}
            component={RootUserPage}
          />
          <PrivateRoute
            exact
            path="/reports"
            layout={MainLayout}
            component={ReportsPage}
          />
          <PrivateRoute
            exact
            path="/settings"
            layout={MainLayout}
            component={SettingsPage}
            allowedUserRoles={[Role.ADMIN]}
          />
          <Route path="/forbidden-account" component={ForbiddenAccount} />
          <Route path="/forbidden" component={Forbidden} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default App;
