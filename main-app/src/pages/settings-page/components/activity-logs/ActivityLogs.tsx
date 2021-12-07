import { ReactElement, Fragment, useState } from 'react';
import { ActivityLogsTable } from './components';
import Button from 'react-bootstrap/Button';
import { Stack } from 'react-bootstrap';
import { UsersDropdown } from './components';

export const ActivityLogs = (): ReactElement => {
  const [username, setUsername] = useState<string>('');
  console.log(username);
  const downloadActivity = () => {};

  return (
    <Fragment>
      <div className="d-flex justify-content-between align-items-center flex-wrap my-2">
        <Stack direction="horizontal" gap={3}>
          <UsersDropdown onChange={setUsername} />
          {/* <OperationDropdown
            selected={selectedOperation}
            onChange={setSelectedOperation}
          /> */}
        </Stack>
        <Button variant="outline-secondary" onClick={downloadActivity}>
          Download
        </Button>
      </div>
      <ActivityLogsTable />
    </Fragment>
  );
};

export default ActivityLogs;
