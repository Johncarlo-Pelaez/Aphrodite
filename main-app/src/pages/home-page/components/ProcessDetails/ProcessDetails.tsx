import { ReactElement } from 'react';
import Card from 'react-bootstrap/Card';

export const ProcessDetails = (): ReactElement => {
  return (
    <div className="d-flex justify-content-center my-4">
      <Card
        className="shadow-sm mx-3"
        style={{ width: '20rem', border: '0px' }}
      >
        <Card.Body>
          <Card.Title>Success</Card.Title>
          <Card.Text className="text-center p-3 fs-4">0</Card.Text>
        </Card.Body>
      </Card>
      <Card
        className="shadow-sm mx-3"
        style={{ width: '20rem', border: '0px' }}
      >
        <Card.Body>
          <Card.Title>Proccessing / Waiting</Card.Title>
          <Card.Text className="text-center p-3 fs-4">0</Card.Text>
        </Card.Body>
      </Card>
      <Card
        className="shadow-sm mx-3"
        style={{ width: '20rem', border: '0px' }}
      >
        <Card.Body>
          <Card.Title>Cancelled / Error</Card.Title>
          <Card.Text className="text-center p-3 fs-4">0</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProcessDetails;
