import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useReportApproval, useDownloadReportApproval } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { ApprovalReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button, Toast } from 'react-bootstrap';
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
}

export const ApprovalReportTable = ({
  username,
  from,
  to,
}: ApprovalReportTableProps): ReactElement => {
  const [currentPageApproval, setCurrentPageApproval] = useState<number>(1);
  const [pageSizeApproval, setPageSizeApproval] = useState<number>(15);
  const [sorterApproval, setSorterApproval] = useState<
    SorterResult | undefined
  >(DEFAULT_SORT_ORDER_APPROVAL_REPORT);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [displayErrorMessage, setDisplayErrorMessage] =
    useState<boolean>(false);

  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadApprovalReportAsync,
  } = useDownloadReportApproval();

  const changeSortApproval = (sorterResult?: SorterResult): void => {
    setSorterApproval(sorterResult ?? DEFAULT_SORT_ORDER_APPROVAL_REPORT);
  };

  const downloadReportApproval = async (): Promise<void> => {
    if (!from || !to) {
      setErrorMessage('Date range of date approved must be selected');
      setDisplayErrorMessage(true);
    }

    if (from && to) {
      if (from > to) {
        setErrorMessage('Incorrect date range of date approved');
        setDisplayErrorMessage(true);
        return;
      }

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
  };

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
    () => ({ approved: result?.data ?? [], approvedTotal: result?.count ?? 0 }),
    [result?.data, result?.count],
  );

  return (
    <div>
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
        data={approved}
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
