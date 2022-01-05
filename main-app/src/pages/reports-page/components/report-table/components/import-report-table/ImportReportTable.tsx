import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useReportImport, useDownloadReportImport } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { ImportReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button, Toast } from 'react-bootstrap';
import styles from './ImportReportTable.module.css';
import { downloadFile } from 'utils';

const DEFAULT_SORT_ORDER_IMPORT_REPORT: SorterResult = {
  field: 'importedDate',
  order: SortOrder.DESC,
};

export interface ImportReportTableProps {
  username?: string;
  from?: Date;
  to?: Date;
}

export const ImportReportTable = ({
  username,
  from,
  to,
}: ImportReportTableProps): ReactElement => {
  const [currentPageImport, setCurrentPageImport] = useState<number>(1);
  const [pageSizeImport, setPageSizeImport] = useState<number>(15);
  const [sorterImport, setSorterImport] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER_IMPORT_REPORT,
  );

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [displayErrorMessage, setDisplayErrorMessage] =
    useState<boolean>(false);

  const {
    isLoading: isDownloadLoading,
    mutateAsync: downloadImportReportAsync,
  } = useDownloadReportImport();

  const changeSortImport = (sorterResult?: SorterResult): void => {
    setSorterImport(sorterResult ?? DEFAULT_SORT_ORDER_IMPORT_REPORT);
  };

  const downloadReportImport = async (): Promise<void> => {
    if (!from || !to) {
      setErrorMessage('Date range of date import must be selected');
      setDisplayErrorMessage(true);
    }

    if (from && to) {
      if (from > to) {
        setErrorMessage('Incorrect date range of date import');
        setDisplayErrorMessage(true);
        return;
      }

      const importParams = await downloadImportReportAsync({
        username,
        from,
        to,
      });

      downloadFile({
        file: importParams,
        filename: `Import_Report_${getCurrentDate()}.xlsx`,
      });
    }
  };

  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
  };

  const renderColumnsImport = (): TableColumnProps<ImportReport>[] => [
    {
      title: 'Date Imported',
      dataIndex: 'importedDate',
      render: ({ importedDate }: ImportReport) =>
        moment(importedDate).format(DEFAULT_DATE_FORMAT),
      sorter: sortDateTime('importedDate'),
      sortOrder:
        sorterImport?.field === 'importedDate' ? sorterImport.order : undefined,
    },
    {
      title: 'File name',
      dataIndex: 'filename',
    },
    {
      title: 'Username',
      dataIndex: 'username',
    },
    {
      title: 'Size',
      dataIndex: 'documentSize',
      render: ({ documentSize }: ImportReport) => {
        return fileSize(documentSize);
      },
    },
  ];

  const {
    isFetching,
    isLoading,
    isError: hasDocsError,
    data: result,
  } = useReportImport({
    currentPage: currentPageImport,
    pageSize: pageSizeImport,
    from,
    to,
    username,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { imported, importedTotal } = useMemo(
    () => ({ imported: result?.data ?? [], importedTotal: result?.count ?? 0 }),
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
        onClick={downloadReportImport}
        className={styles.prop}
      >
        Download
      </Button>
      <Table<ImportReport>
        isServerSide
        rowKey={(doc) => doc.documentId}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumnsImport()}
        data={imported}
        pagination={{
          total: importedTotal,
          pageSize: pageSizeImport,
          current: currentPageImport,
          pageNumber: 5,
          onChange: (page) => {
            setCurrentPageImport(page);
          },
          onSizeChange: setPageSizeImport,
        }}
        onChange={changeSortImport}
      />
    </div>
  );
};

export default ImportReportTable;
