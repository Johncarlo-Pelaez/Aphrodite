import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocumentReportUploaded, useDocumentReportInfoRequest } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { DocumentReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button } from 'react-bootstrap';

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'createdDate',
  order: SortOrder.DESC,
};

export interface DataFilterProps {}

export interface DocumentsTableProps {
  dateFrom?: Date;
  dateTo?: Date;
  username?: string;
  reportType?: string;
}

export const ReportTable = ({
  dateFrom,
  dateTo,
  username,
  reportType,
}: DocumentsTableProps): ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [sorter, setSorter] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER,
  );

  const renderColumns = (): TableColumnProps<DocumentReport>[] => [
    {
      title: 'Date Created',
      dataIndex: 'type',
      render: ({ createdDate }: DocumentReport) =>
        moment(createdDate).format(DEFAULT_DATE_FORMAT),
      sorter: sortDateTime('createdDate'),
      sortOrder: sorter?.field === 'createdDate' ? sorter.order : undefined,
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

  const renderTable = (): ReactElement => {
    console.log(reportType);
    if (reportType === 'UPLOADED') return renderReportTableUploaded();
    if (reportType === 'INFORMATION REQUEST')
      return renderReportTableInfoRequest();
    else return <div>wews</div>;
  };
  const renderReportTableUploaded = (): ReactElement => {
    const {
      isFetching,
      isLoading,
      isError: hasDocsError,
      data: result,
      // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useDocumentReportInfoRequest({
      currentPage,
      pageSize,
      from: dateFrom,
      to: dateTo,
      username,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { documents, total } = useMemo(
      () => ({ documents: result?.data ?? [], total: result?.count ?? 0 }),
      [result?.data, result?.count],
    );

    return (
      <div>
        <Table<DocumentReport>
          isServerSide
          rowKey={(doc) => doc.id}
          loading={isLoading || isFetching}
          isError={hasDocsError}
          columns={renderColumns()}
          data={documents}
          pagination={{
            total: total,
            pageSize: pageSize,
            current: currentPage,
            pageNumber: 5,
            onChange: (page) => {
              setCurrentPage(page);
            },
            onSizeChange: setPageSize,
          }}
          onChange={changeSort}
        />
        <Button>Download</Button>
      </div>
    );
  };

  const renderReportTableInfoRequest = (): ReactElement => {
    const {
      isFetching,
      isLoading,
      isError: hasDocsError,
      data: result,
      // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useDocumentReportUploaded({
      currentPage,
      pageSize,
      from: dateFrom,
      to: dateTo,
      username,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { documents, total } = useMemo(
      () => ({ documents: result?.data ?? [], total: result?.count ?? 0 }),
      [result?.data, result?.count],
    );

    return (
      <div>
        <Table<DocumentReport>
          isServerSide
          rowKey={(doc) => doc.id}
          loading={isLoading || isFetching}
          isError={hasDocsError}
          columns={renderColumns()}
          data={documents}
          pagination={{
            total: total,
            pageSize: pageSize,
            current: currentPage,
            pageNumber: 5,
            onChange: (page) => {
              setCurrentPage(page);
            },
            onSizeChange: setPageSize,
          }}
          onChange={changeSort}
        />
        <Button>Download</Button>
      </div>
    );
  };

  const changeSort = (sorterResult?: SorterResult): void => {
    setSorter(sorterResult ?? DEFAULT_SORT_ORDER);
  };

  return renderTable();
};

export default ReportTable;
