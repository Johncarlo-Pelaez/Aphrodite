import { ReactElement, Fragment, useState } from 'react';
import { ActivityLogsTable } from './components';
import Button from 'react-bootstrap/Button';
import { Stack } from 'react-bootstrap';
import { UsersDropdown, DateRange } from './components';
import { downloadFile } from 'utils';
import { useDownloadActivityLogs } from 'hooks';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
export const ActivityLogs = (): ReactElement => {
  const [username, setUsername] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date());
  const [dateTo, setDateTo] = useState<Date | null>(new Date());

  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadActivityLogsAsync,
  } = useDownloadActivityLogs();

  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
  };

  const downloadActivityLogs = async (): Promise<void> => {
    if (username && dateFrom && dateTo) {
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
      <div className="d-flex justify-content-between align-items-center flex-wrap my-2">
        <Stack direction="horizontal" gap={3}>
          <UsersDropdown onChange={setUsername} />
          <DateRange setDateFrom={setDateFrom} setDateTo={setDateTo} />
        </Stack>
        <Button
          disabled={isDownloadLoading}
          variant="outline-secondary"
          onClick={downloadActivityLogs}
        >
          Download
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
