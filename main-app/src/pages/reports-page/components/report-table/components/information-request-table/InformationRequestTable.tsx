import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocumentReportInfoRequest } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { InformationRequestReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button } from 'react-bootstrap';

const DEFAULT_SORT_ORDER_INFO_REQUEST: SorterResult = {
  field: 'requestedDate',
  order: SortOrder.DESC,
};

export interface InformationRequestTableProps {
  username?: string;
  from?: Date;
  to?: Date;
}

export const InformationRequestTable = ({
  username,
  from,
  to,
}: InformationRequestTableProps): ReactElement => {
  const [currentPageInfoReq, setCurrentPageInfoReq] = useState<number>(1);
  const [pageSizeInfoReq, setPageSizeInfoReq] = useState<number>(15);
  const [sorterInfoReq, setSorterInfoReq] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER_INFO_REQUEST,
  );

  const changeSortInfoRequest = (sorterResult?: SorterResult): void => {
    setSorterInfoReq(sorterResult ?? DEFAULT_SORT_ORDER_INFO_REQUEST);
  };
  const renderColumnsInfoRequest =
    (): TableColumnProps<InformationRequestReport>[] => [
      {
        title: 'Date Requested',
        dataIndex: 'requestedDate',
        render: ({ requestedDate }: InformationRequestReport) =>
          moment(requestedDate).format(DEFAULT_DATE_FORMAT),
        sorter: sortDateTime('createdDate'),
        sortOrder:
          sorterInfoReq?.field === 'requestedDate'
            ? sorterInfoReq.order
            : undefined,
      },
      {
        title: 'Filename',
        dataIndex: 'filename',
      },
      {
        title: 'Total Page',
        dataIndex: 'pageTotal',
      },
      {
        title: 'Size',
        dataIndex: 'documentSize',
        render: ({ documentSize }: InformationRequestReport) => {
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
  } = useDocumentReportInfoRequest({
    currentPage: currentPageInfoReq,
    pageSize: pageSizeInfoReq,
    from,
    to,
    username,
  });

  console.log(result);

  const { infoRequest, infoRequestTotal } = useMemo(
    () => ({
      infoRequest: result?.data ?? [],
      infoRequestTotal: result?.count ?? 0,
    }),
    [result?.data, result?.count],
  );

  return (
    <div>
      <Table<InformationRequestReport>
        isServerSide
        rowKey={(doc) => doc.documentId}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumnsInfoRequest()}
        data={infoRequest}
        pagination={{
          total: infoRequestTotal,
          pageSize: pageSizeInfoReq,
          current: currentPageInfoReq,
          pageNumber: 5,
          onChange: (page) => {
            setCurrentPageInfoReq(page);
          },
          onSizeChange: setPageSizeInfoReq,
        }}
        onChange={changeSortInfoRequest}
      />
      <Button>Download</Button>
    </div>
  );
};

export default InformationRequestTable;
