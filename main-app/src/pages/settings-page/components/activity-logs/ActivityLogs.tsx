import { ReactElement, Fragment, useState } from 'react';
import { ActivityLogsTable } from './components';
import { Stack, Toast, Button } from 'react-bootstrap';
import { UsersDropdown, DateRange } from './components';
import { downloadFile } from 'utils';
import { useDownloadActivityLogs } from 'hooks';
import moment from 'moment';
import { DEFAULT_ALL_USER_SELECTED, DEFAULT_DATE_FORMAT } from 'core/constants';

export const ActivityLogs = (): ReactElement => {
  const [username, setUsername] = useState<string>(DEFAULT_ALL_USER_SELECTED);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [displayErrorMessage, setDisplayErrorMessage] =
    useState<boolean>(false);

  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadActivityLogsAsync,
  } = useDownloadActivityLogs();

  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
  };

  const downloadActivityLogs = async (): Promise<void> => {
    if (!dateFrom || !dateTo) {
      setErrorMessage('Date range of activity logged must be selected');
      setDisplayErrorMessage(true);
    }

    if (dateFrom && dateTo) {
      if (dateFrom > dateTo) {
        setErrorMessage('Incorrect date range of actvity logged');
        setDisplayErrorMessage(true);
        return;
      }

      const activityParams = await downloadActivityLogsAsync({
        loggedBy: username,
        loggedAtFrom: dateFrom,
        loggedAtTo: dateTo,
      });

      downloadFile({
        file: activityParams,
        filename: `Activity_Logs_${getCurrentDate()}.xlsx`,
      });
    }
  };

  return (
    <Fragment>
      <Toast
        className="error-date-range d-inline-block m-1"
        bg="light"
        autohide
        show={displayErrorMessage}
        onClose={() => setDisplayErrorMessage(false)}
      >
        <Toast.Header>
          <strong className="me-auto">Download warning</strong>
        </Toast.Header>
        <Toast.Body className="light text-dark">{errorMessage}</Toast.Body>
      </Toast>
      <div className="d-flex justify-content-between align-items-center flex-wrap my-1">
        <Stack direction="horizontal" gap={2} className="m-2">
            <UsersDropdown onChange={setUsername} />

          <DateRange
            setDateFrom={setDateFrom}
            setDateTo={setDateTo}
            dateFrom={dateFrom}
            dateTo={dateTo}
          />
        </Stack>
        <Button
          disabled={isDownloadLoading}
          variant="outline-secondary"
          onClick={downloadActivityLogs}
        >
          Download Logs
        </Button>
      </div>
      <ActivityLogsTable
        loggedBy={username}
        loggedAtFrom={dateFrom}
        loggedAtTo={dateTo}
      />
    </Fragment>
  );
};

export default ActivityLogs;
