import { ReactElement, Fragment, useState } from 'react';
import { ActivityLogsTable } from './components';
import Button from 'react-bootstrap/Button';
import { Badge, Card, Stack } from 'react-bootstrap';
import { UsersDropdown, DateRange } from './components';
import { downloadFile } from 'utils';
import { useDownloadActivityLogs } from 'hooks';
import moment from 'moment';
import { DEFAULT_ALL_USER_SELECTED, DEFAULT_DATE_FORMAT } from 'core/constants';

export const ActivityLogs = (): ReactElement => {
  const [username, setUsername] = useState<string>(DEFAULT_ALL_USER_SELECTED);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadActivityLogsAsync,
  } = useDownloadActivityLogs();

  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
  };

  const downloadActivityLogs = async (): Promise<void> => {
    if (username && dateFrom && dateTo) {
      const start = new Date(moment(dateFrom).format(DEFAULT_DATE_FORMAT));
      start.setDate(start.getDate() - 1);

      const end = new Date(moment(dateTo).format(DEFAULT_DATE_FORMAT));
      end.setDate(end.getDate() - 1);

      const activityParams = await downloadActivityLogsAsync({
        loggedBy: username,
        loggedAtFrom: start,
        loggedAtTo: end,
      });

      downloadFile({
        file: activityParams,
        filename: `Activity_Logs_${getCurrentDate()}.xlsx`,
      });
    }
  };

  return (
    <Fragment>
      <Card>
        <Badge className="d-flex flex-column flex-wrap lh-lg fs-150" bg="light">
          <h4 className="text-muted mx-auto mb-0 fw-normal">Activity Logs</h4>
        </Badge>
      </Card>
      <div className="d-flex justify-content-between align-items-center flex-wrap position-relative my-3.5">
        <Stack direction="horizontal" gap={2}>
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
