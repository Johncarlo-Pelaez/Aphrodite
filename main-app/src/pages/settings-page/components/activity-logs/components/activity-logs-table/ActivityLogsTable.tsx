import {
  ReactElement,
  useState,
  useMemo,
  useEffect,
  useCallback,
  SetStateAction,
  Dispatch,
} from 'react';
import { SorterResult, SortOrder, Table, TableColumnProps } from 'core/ui';
import { useActivityLog } from 'hooks';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { sortDateTime } from 'utils/sort';
import { ActivityLog } from 'models';
import { Card } from 'react-bootstrap';
import moment from 'moment';

export interface ActivityLogTableProps {
  loggedBy: string;
  loggedAtFrom: Date | undefined;
  loggedAtTo: Date | undefined;
  setTablePageSize: Dispatch<SetStateAction<number>>;
  setTableCurrentPage: Dispatch<SetStateAction<number>>;
}

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'loggedAt',
  order: SortOrder.DESC,
};

export const ActivityLogsTable = ({
  loggedBy,
  loggedAtFrom,
  loggedAtTo,
  setTablePageSize,
  setTableCurrentPage,
}: ActivityLogTableProps): ReactElement => {
  const [sorter, setSorter] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  const {
    isLoading: isActivityLoading,
    isError: hasActivityError,
    data: result,
  } = useActivityLog({
    loggedBy: loggedBy,
    loggedAtFrom: from,
    loggedAtTo: to,
    currentPage,
    pageSize,
  });

  const { activityLog, total } = useMemo(
    () => ({ activityLog: result?.data ?? [], total: result?.count ?? 0 }),
    [result?.data, result?.count],
  );

  const renderColumns = (): TableColumnProps<ActivityLog>[] => [
    {
      title: 'Activities',
      dataIndex: 'type',
      render: ({ type }: ActivityLog) => {
        return type;
      },
    },
    {
      title: 'Descriptions',
      dataIndex: 'description',
    },
    {
      title: 'Date Logged',
      dataIndex: 'loggedAt',
      render: ({ loggedAt }: ActivityLog) =>
        moment(loggedAt).format(DEFAULT_DATE_FORMAT),
      sorter: sortDateTime('loggedAt'),
      sortOrder: sorter?.field === 'loggedAt' ? sorter.order : undefined,
    },
  ];

  const changeSort = (sorterResult?: SorterResult): void => {
    setSorter(sorterResult ?? DEFAULT_SORT_ORDER);
  };

  const processDateRangeValue = useCallback(() => {
    const start = new Date(moment(loggedAtFrom).format(DEFAULT_DATE_FORMAT));
    start.setDate(start.getDate() - 1);
    setFrom(start);

    const end = new Date(moment(loggedAtTo).format(DEFAULT_DATE_FORMAT));
    end.setDate(end.getDate() - 1);
    setTo(end);
  }, [loggedAtFrom, loggedAtTo]);

  useEffect(() => {
    if (loggedAtFrom && loggedAtTo) processDateRangeValue();

    return () => {
      setCurrentPage(1);
      setPageSize(15);
      setFrom(undefined);
      setTo(undefined);
    };
  }, [loggedAtFrom, loggedAtTo, processDateRangeValue]);

  return (
    <Card>
      <Card.Body className="p-1 m-1 display-fixed">
        <Table<ActivityLog>
          isServerSide
          rowKey={(activity) => activity.id}
          loading={isActivityLoading}
          isError={hasActivityError}
          columns={renderColumns()}
          data={activityLog}
          pagination={{
            total: total,
            pageSize: pageSize,
            current: currentPage,
            pageNumber: 5,
            onChange: (page) => {
              setCurrentPage(page);
            },
            onSizeChange: setPageSize,
          }}
          onChange={changeSort}
        />
      </Card.Body>
    </Card>
  );
};

export default ActivityLogsTable;
