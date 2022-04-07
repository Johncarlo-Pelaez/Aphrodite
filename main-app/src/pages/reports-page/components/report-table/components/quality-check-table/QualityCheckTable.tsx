import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocumentReportQC, useDownloadQualityCheck } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { QualityCheckReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button } from 'react-bootstrap';
import styles from './QualityCheckTable.module.css';
import { downloadFile } from 'utils';

const DEFAULT_SORT_ORDER_QUALITY_CHECK: SorterResult = {
  field: 'checkedDate',
  order: SortOrder.DESC,
};

export interface QualityCheckTableProps {
  username?: string;
  from?: Date;
  to?: Date;
}

export const QualityCheckTable = ({
  username,
  from,
  to,
}: QualityCheckTableProps): ReactElement => {
  const [currentPageQualityCheck, setCurrentPageQualityCheck] =
    useState<number>(1);
  const [pageSizeQualityCheck, setPageSizeQualityCheck] = useState<number>(15);
  const [sorterQualityCheck, setSorterQualityCheck] = useState<
    SorterResult | undefined
  >(DEFAULT_SORT_ORDER_QUALITY_CHECK);

  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadQualityCheckReportAsync,
  } = useDownloadQualityCheck();

  const changeSortQualityCheck = (sorterResult?: SorterResult): void => {
    setSorterQualityCheck(sorterResult ?? DEFAULT_SORT_ORDER_QUALITY_CHECK);
  };

  const downloadReportQualityCheck = async (): Promise<void> => {
    if(!!qualityCheck && qualityCheckTotal > 0)
    {
      const qualityCheckParams = await downloadQualityCheckReportAsync({
        username,
        from,
        to,
      });

      downloadFile({
        file: qualityCheckParams,
        filename: `Quality_Check_Report_${getCurrentDate()}.xlsx`,
      });
    }
  }


  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
  };
  const renderColumnsQualityChecked =
    (): TableColumnProps<QualityCheckReport>[] => [
      {
        title: 'Date Checked',
        dataIndex: 'checkedDate',
        render: ({ checkedDate }: QualityCheckReport) =>
          moment(checkedDate).format(DEFAULT_DATE_FORMAT),
        sorter: sortDateTime('checkedDate'),
        sortOrder:
          sorterQualityCheck?.field === 'checkedDate'
            ? sorterQualityCheck.order
            : undefined,
      },
      {
        title: 'Filename',
        dataIndex: 'filename',
      },
      {
        title: 'Checker',
        dataIndex: 'checker',
      },
      {
        title: 'Size',
        dataIndex: 'documentSize',
        render: ({ documentSize }: QualityCheckReport) => {
          return fileSize(documentSize);
        },
      },
    ];

  const {
    isFetching,
    isLoading,
    isError: hasDocsError,
    data: result,
  } = useDocumentReportQC({
    currentPage: currentPageQualityCheck,
    pageSize: pageSizeQualityCheck,
    from,
    to,
    username,
  });

  const { qualityCheck, qualityCheckTotal } = useMemo(
    () => ({
      qualityCheck: result?.data ?? [],
      qualityCheckTotal: result?.count ?? 0,
    }),
    [result?.data, result?.count],
  );

  return (
    <div>
      <Button
        disabled={isDownloadLoading}
        variant="outline-secondary"
        onClick={downloadReportQualityCheck}
        className={styles.prop}
      >
        Download
      </Button>
      <Table<QualityCheckReport>
        isServerSide
        rowKey={(doc) => doc.documentId}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumnsQualityChecked()}
        data={qualityCheck}
        pagination={{
          total: qualityCheckTotal,
          pageSize: pageSizeQualityCheck,
          current: currentPageQualityCheck,
          pageNumber: 5,
          onChange: (page) => {
            setCurrentPageQualityCheck(page);
          },
          onSizeChange: setPageSizeQualityCheck,
        }}
        onChange={changeSortQualityCheck}
      />
    </div>
  );
};

export default QualityCheckTable;
