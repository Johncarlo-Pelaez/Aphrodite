import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Suspense, lazy } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { MainLayout, PublicLayout } from 'layouts';
import { AuthRoute, ProtectedRoute } from 'routes';
import { FullHeightSpinner } from 'core/ui';

const HomePage = lazy(() => import('pages/home-page'));
const LoginPage = lazy(() => import('pages/login-page'));
const UsersPage = lazy(() => import('pages/users-page'));
const NotFoundPage = lazy(() => import('pages/not-found-page'));
const Forbidden = lazy(() => import('pages/forbidden'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export interface AppProps {
  msalInstance: IPublicClientApplication;
}

function App({ msalInstance }: AppProps) {
  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<FullHeightSpinner />}>
          <Router>
            <Switch>
              <AuthRoute
                exact
                path="/auth"
                layout={PublicLayout}
                component={LoginPage}
              />
              <ProtectedRoute
                exact
                path="/"
                layout={MainLayout}
                component={HomePage}
              />
              <ProtectedRoute
                exact
                path="/users"
                layout={MainLayout}
                component={UsersPage}
              />
              <Route component={NotFoundPage} />
              <Route exact path="/forbidden" component={Forbidden} />
            </Switch>
          </Router>
        </Suspense>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </MsalProvider>
  );
}

export default App;
