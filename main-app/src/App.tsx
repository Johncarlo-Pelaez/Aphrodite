import { IPublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { HomePage, LoginPage, NotFoundPage } from './pages';

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
        <Router>
          <Switch>
            <Route exact path="/" component={LoginPage} />
            <Route path="/app" component={HomePage} />
            <Route component={NotFoundPage} />
          </Switch>
        </Router>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </MsalProvider>
  );
}

export default App;
