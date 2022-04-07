import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useReportApproval, useDownloadReportApproval } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { ApprovalReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button } from 'react-bootstrap';
import styles from './ApprovalReportTable.module.css';
import { downloadFile } from 'utils';

const DEFAULT_SORT_ORDER_APPROVAL_REPORT: SorterResult = {
  field: 'approvalDate',
  order: SortOrder.DESC,
};

export interface ApprovalReportTableProps {
  username?: string;
  from?: Date;
  to?: Date;
  isTriggered?: boolean;
}

export const ApprovalReportTable = ({
  username,
  from,
  to,
  isTriggered,
}: ApprovalReportTableProps): ReactElement => {
  const [currentPageApproval, setCurrentPageApproval] = useState<number>(1);
  const [pageSizeApproval, setPageSizeApproval] = useState<number>(15);
  const [sorterApproval, setSorterApproval] = useState<
    SorterResult | undefined
  >(DEFAULT_SORT_ORDER_APPROVAL_REPORT);

  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadApprovalReportAsync,
  } = useDownloadReportApproval();

  const changeSortApproval = (sorterResult?: SorterResult): void => {
    setSorterApproval(sorterResult ?? DEFAULT_SORT_ORDER_APPROVAL_REPORT);
  };

  const downloadReportApproval = async (): Promise<void> => {
    if(!!approved && approvedTotal > 0)
    {
      const approvalParams = await downloadApprovalReportAsync({
        username,
        from,
        to,
      });

      downloadFile({
        file: approvalParams,
        filename: `Approval_Report_${getCurrentDate()}.xlsx`,
      });
    }
  }

  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
  };

  const renderColumnsUpload = (): TableColumnProps<ApprovalReport>[] => [
    {
      title: 'Date Approved',
      dataIndex: 'approvalDate',
      render: ({ approvalDate }: ApprovalReport) =>
        moment(approvalDate).format(DEFAULT_DATE_FORMAT),
      sorter: sortDateTime('approvalDate'),
      sortOrder:
        sorterApproval?.field === 'approvalDate'
          ? sorterApproval.order
          : undefined,
    },
    {
      title: 'File name',
      dataIndex: 'filename',
    },
    {
      title: 'Approver',
      dataIndex: 'approver',
    },
    {
      title: 'Size',
      dataIndex: 'documentSize',
      render: ({ documentSize }: ApprovalReport) => {
        return fileSize(documentSize);
      },
    },
  ];

  const {
    isFetching,
    isLoading,
    isError: hasDocsError,
    data: result,
  } = useReportApproval({
    currentPage: currentPageApproval,
    pageSize: pageSizeApproval,
    from,
    to,
    username,
  });

  const { approved, approvedTotal } = useMemo(
    () => ({ approved: !!isTriggered ? result?.data : [], approvedTotal: result?.count ?? 0 }),
    [result?.data, result?.count, isTriggered],
  );

  return (
    <div>
      <Button
        disabled={isDownloadLoading}
        variant="outline-secondary"
        onClick={downloadReportApproval}
        className={styles.prop}
      >
        Download
      </Button>
      <Table<ApprovalReport>
        isServerSide
        rowKey={(doc) => doc.documentId}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumnsUpload()}
        data={approved ?? []}
        pagination={{
          total: approvedTotal,
          pageSize: pageSizeApproval,
          current: currentPageApproval,
          pageNumber: 5,
          onChange: (page) => {
            setCurrentPageApproval(page);
          },
          onSizeChange: setPageSizeApproval,
        }}
        onChange={changeSortApproval}
      />
    </div>
  );
};

export default ApprovalReportTable;
