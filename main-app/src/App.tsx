import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { Suspense, lazy } from 'react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

const HomePage = lazy(() => import('pages/home-page'));
const LoginPage = lazy(() => import('pages/login-page'));
const NotFoundPage = lazy(() => import('pages/not-found-page'));

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
        <Suspense fallback={<Spinner animation="border" />}>
          <Router>
            <Switch>
              <Route exact path="/" component={LoginPage} />
              <Route path="/app" component={HomePage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </Suspense>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </MsalProvider>
  );
}

export default App;
