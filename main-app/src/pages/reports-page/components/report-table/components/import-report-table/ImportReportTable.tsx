import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useReportImport } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { ImportReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button } from 'react-bootstrap';
import styles from './ImportReportTable.module.css';

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

  const changeSortImport = (sorterResult?: SorterResult): void => {
    setSorterImport(sorterResult ?? DEFAULT_SORT_ORDER_IMPORT_REPORT);
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
      <Button variant="outline-secondary" className={styles.prop} disabled>
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
