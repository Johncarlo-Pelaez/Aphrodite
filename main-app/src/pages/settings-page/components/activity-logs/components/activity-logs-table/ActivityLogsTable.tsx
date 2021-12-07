import { ReactElement, useState, useMemo } from 'react';
import { useActivityLogs } from 'hooks';
import { SorterResult, SortOrder, Table, TableColumnProps } from 'core/ui';
import { ActivityLog } from 'models';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { sortDateTime } from 'utils/sort';

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'loggedAt',
  order: SortOrder.DESC,
};

export const ActivityLogsTable = (): ReactElement => {
  const [sorter, setSorter] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const {
    isLoading: isActivityLoading,
    isError: hasActivityError,
    data: result,
  } = useActivityLogs();
  const { activityLog, total } = useMemo(
    () => ({ activityLog: result?.data ?? [], total: result?.count ?? 0 }),
    [result?.data, result?.count],
  );

  const columns: TableColumnProps<ActivityLog>[] = [
    {
      title: 'Activity',
      dataIndex: 'type',
      render: (activity: ActivityLog) => {
        return activity.type;
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Logged At',
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

  return (
    <Table<ActivityLog>
      rowKey={(activity) => activity.id}
      loading={isActivityLoading}
      isError={hasActivityError}
      columns={columns}
      data={activityLog}
      pagination={{
        total: total,
        pageSize: pageSize,
        current: currentPage,
        pageNumber: 5,
        onChange: setCurrentPage,
        onSizeChange: setPageSize,
      }}
      onChange={changeSort}
    />
  );
};

export default ActivityLogsTable;
