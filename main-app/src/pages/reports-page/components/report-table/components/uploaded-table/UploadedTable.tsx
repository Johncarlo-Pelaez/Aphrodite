import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocumentReportUploaded } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { DocumentReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button } from 'react-bootstrap';

const DEFAULT_SORT_ORDER_UPLOADED: SorterResult = {
  field: 'createdDate',
  order: SortOrder.DESC,
};

export interface UploadedTableProps {
  username?: string;
  from?: Date;
  to?: Date;
}

export const UploadedTable = ({
  username,
  from,
  to,
}: UploadedTableProps): ReactElement => {
  const [currentPageUploaded, setCurrentPageUploaded] = useState<number>(1);
  const [pageSizeUploaded, setPageSizeUploaded] = useState<number>(15);
  const [sorterUploaded, setSorterUploaded] = useState<
    SorterResult | undefined
  >(DEFAULT_SORT_ORDER_UPLOADED);

  const changeSortUploaded = (sorterResult?: SorterResult): void => {
    setSorterUploaded(sorterResult ?? DEFAULT_SORT_ORDER_UPLOADED);
  };
  const renderColumnsUpload = (): TableColumnProps<DocumentReport>[] => [
    {
      title: 'Date Created',
      dataIndex: 'type',
      render: ({ createdDate }: DocumentReport) =>
        moment(createdDate).format(DEFAULT_DATE_FORMAT),
      sorter: sortDateTime('createdDate'),
      sortOrder:
        sorterUploaded?.field === 'createdDate'
          ? sorterUploaded.order
          : undefined,
    },
    {
      title: 'Descriptions',
      dataIndex: 'description',
    },
    {
      title: 'Uploader',
      dataIndex: 'userUsername',
    },
    {
      title: 'Size',
      dataIndex: 'documentSize',
      render: ({ documentSize }: DocumentReport) => {
        var docSize: number = +documentSize;
        return fileSize(docSize);
      },
    },
  ];

  const {
    isFetching,
    isLoading,
    isError: hasDocsError,
    data: result,
  } = useDocumentReportUploaded({
    currentPage: currentPageUploaded,
    pageSize: pageSizeUploaded,
    from,
    to,
    username,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { uploaded, total } = useMemo(
    () => ({ uploaded: result?.data ?? [], total: result?.count ?? 0 }),
    [result?.data, result?.count],
  );

  return (
    <div>
      <Table<DocumentReport>
        isServerSide
        rowKey={(doc) => doc.id}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumnsUpload()}
        data={uploaded}
        pagination={{
          total: total,
          pageSize: pageSizeUploaded,
          current: currentPageUploaded,
          pageNumber: 5,
          onChange: (page) => {
            setCurrentPageUploaded(page);
          },
          onSizeChange: setPageSizeUploaded,
        }}
        onChange={changeSortUploaded}
      />
      <Button>Download</Button>
    </div>
  );
};

export default UploadedTable;
