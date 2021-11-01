import {
  useAccount,
  useEmailAllowed,
  useLoadAccountToken,
  useSignOut,
} from 'hooks';
import { useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import { useHistory } from 'react-router-dom';

export const ForbiddenAccount = () => {
  const history = useHistory();
  const { account } = useAccount();
  const { signOut } = useSignOut();
  const { isAllowed } = useEmailAllowed();
  const { isLoaded } = useLoadAccountToken();

  useEffect(() => {
    if (isLoaded && isAllowed) {
      history.replace('/');
    }
  }, [isLoaded, isAllowed, history]);

  if (!isLoaded || (isLoaded && isAllowed)) {
    return null;
  }

  return (
    <Container>
      <Alert variant="danger">
        The account ({account?.username}) is not allowed to access the
        application. Click{' '}
        <a
          href="/"
          onClick={async (e) => {
            e.preventDefault();
            await signOut();
            history.replace('/auth');
          }}
        >
          here
        </a>{' '}
        to sign out.
      </Alert>
    </Container>
  );
};
