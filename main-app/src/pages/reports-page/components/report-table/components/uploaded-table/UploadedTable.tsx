import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import {
  useDocumentReportUploaded,
  useDownloadDocumentReportUploaded,
} from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { DocumentReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button } from 'react-bootstrap';
import { downloadFile } from 'utils';
import styles from './UploadedTable.module.css';

const DEFAULT_SORT_ORDER_UPLOADED: SorterResult = {
  field: 'createdDate',
  order: SortOrder.DESC,
};

export interface UploadedTableProps {
  username?: string;
  from?: Date;
  to?: Date;
  isTriggered?: boolean;
}

export const UploadedTable = ({
  username,
  from,
  to,
  isTriggered,
}: UploadedTableProps): ReactElement => {
  const [currentPageUploaded, setCurrentPageUploaded] = useState<number>(1);
  const [pageSizeUploaded, setPageSizeUploaded] = useState<number>(15);
  const [sorterUploaded, setSorterUploaded] = useState<
    SorterResult | undefined
    >(DEFAULT_SORT_ORDER_UPLOADED);
  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadUploadedReportAsync,
  } = useDownloadDocumentReportUploaded();

  const changeSortUploaded = (sorterResult?: SorterResult): void => {
    setSorterUploaded(sorterResult ?? DEFAULT_SORT_ORDER_UPLOADED);
  };

  const downloadReportUpload = async () => {
    if(!!uploaded && !!total)
    {
      const uploadedParams = await downloadUploadedReportAsync({
        username,
        from,
        to,
      });

      downloadFile({
        file: uploadedParams,
        filename: `Uploaded_Report_${getCurrentDate()}.xlsx`,
      });
      }
  }

  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
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
      title: 'Document Name',
      dataIndex: 'filename',
    },
    {
      title: 'Uploader',
      dataIndex: 'userUsername',
    },
    {
      title: 'Size',
      dataIndex: 'documentSize',
      render: (document: DocumentReport) => fileSize(document.documentSize),
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

  const { uploaded, total } = useMemo(
    () => ({ uploaded: !!isTriggered ? result?.data : [], total: !!isTriggered ? result?.count : 0 }),
    [result?.data, result?.count, isTriggered],
  );

  return (
    <div>
      <Button
        disabled={isDownloadLoading}
        variant="outline-secondary"
        onClick={downloadReportUpload}
        className={styles.prop}
      >
        Download
      </Button>
      <Table<DocumentReport>
        isServerSide
        rowKey={(doc) => doc.id}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumnsUpload()}
        data={uploaded ?? []}
        pagination={{
          total: total ?? 0,
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
    </div>
  );
};

export default UploadedTable;
