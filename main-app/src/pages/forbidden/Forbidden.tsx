import { ReactElement } from 'react';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useHistory } from 'react-router-dom';

export const Forbidden = (): ReactElement => {
  const history = useHistory();

  const renderResult = (): ReactElement => (
    <Alert variant="danger">
      <Alert.Heading>403 Forbidden</Alert.Heading>
      <p>Sorry, you are not authorized to access this page.</p>
      <hr />
      {renderReturnBtn()}
    </Alert>
  );

  const renderReturnBtn = (): ReactElement | null => {
    return (
      <Button variant="link" onClick={redirectToMainMenu}>
        Back to Main Menu
      </Button>
    );
  };

  const redirectToMainMenu = (): void => {
    history.push('/');
  };

  return renderResult();
};

export default Forbidden;
