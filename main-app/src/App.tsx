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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/login" component={LoginPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
