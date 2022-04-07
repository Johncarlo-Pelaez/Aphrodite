import { ReactElement, useState, useMemo } from 'react';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import {
  useDocumentReportInfoRequest,
  useDownloadDocumentReportInfoRequest,
} from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { InformationRequestReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button } from 'react-bootstrap';
import fileSize from 'filesize';
import styles from './InformationRequestTable.module.css';
import { downloadFile } from 'utils';

const DEFAULT_SORT_ORDER_INFO_REQUEST: SorterResult = {
  field: 'requestedDate',
  order: SortOrder.DESC,
};

export interface InformationRequestTableProps {
  username?: string;
  from?: Date;
  to?: Date;
  isTriggered?: boolean;
}

export const InformationRequestTable = ({
  username,
  from,
  to,
  isTriggered
}: InformationRequestTableProps): ReactElement => {
  const [currentPageInfoReq, setCurrentPageInfoReq] = useState<number>(1);
  const [pageSizeInfoReq, setPageSizeInfoReq] = useState<number>(15);
  const [sorterInfoReq, setSorterInfoReq] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER_INFO_REQUEST,
  );
  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadInfoRequestReportAsync,
  } = useDownloadDocumentReportInfoRequest();

  const changeSortInfoRequest = (sorterResult?: SorterResult): void => {
    setSorterInfoReq(sorterResult ?? DEFAULT_SORT_ORDER_INFO_REQUEST);
  };

  const downloadReportInfoRequest = async (): Promise<void> => {

    if(!!infoRequest && !!infoRequestTotal)
    {
      const infoRequestParams = await downloadInfoRequestReportAsync({
        username,
        from,
        to,
      });

      downloadFile({
        file: infoRequestParams,
        filename: `Information_Request_Report_${getCurrentDate()}.xlsx`,
      });
    }
  }

  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
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
        title: 'Size',
        dataIndex: 'documentSize',
        render: ({ documentSize }: InformationRequestReport) =>
          fileSize(documentSize),
      },
      {
        title: 'Encoder',
        dataIndex: 'encoder',
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

  const { infoRequest, infoRequestTotal } = useMemo(
    () => ({
      infoRequest: !!isTriggered ? result?.data : [],
      infoRequestTotal: !!isTriggered ? result?.count : 0,
    }),
    [result?.data, result?.count, isTriggered],
  );

  return (
    <div>
      <Button
        variant="outline-secondary"
        className={styles.prop}
        disabled={isDownloadLoading}
        onClick={downloadReportInfoRequest}
      >
        Download
      </Button>
      <Table<InformationRequestReport>
        isServerSide
        rowKey={(doc) => doc.documentId}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumnsInfoRequest()}
        data={infoRequest ?? []}
        pagination={{
          total: infoRequestTotal ?? 0,
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
    </div>
  );
};

export default InformationRequestTable;
