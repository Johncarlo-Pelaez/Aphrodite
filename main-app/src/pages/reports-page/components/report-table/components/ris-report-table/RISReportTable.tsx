import { ReactElement, useState, useMemo } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useReportRIS, useDownloadReportRIS } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { RISReport } from 'models';
import { sortDateTime } from 'utils/sort';
import { Button, Toast } from 'react-bootstrap';
import {
  DocumentStatusDropdown,
  NomenclatureDropdown,
  DocTypeRIS,
} from './components';
import { Stack } from 'react-bootstrap';
import { DEFAULT_ALL_DOCUMNET_STATUS } from 'core/constants';
import { downloadFile } from 'utils';

const DEFAULT_SORT_ORDER_RIS_REPORT: SorterResult = {
  field: 'dateIndexed',
  order: SortOrder.DESC,
};

export interface RISReportTableProps {
  username?: string;
  from?: Date;
  to?: Date;
}

export const RISReportTable = ({
  username,
  from,
  to,
}: RISReportTableProps): ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [sorter, setSorter] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER_RIS_REPORT,
  );
  const [nomenclature, setNomenclature] = useState<string | undefined>(
    undefined,
  );
  const [status, setStatus] = useState<string>(DEFAULT_ALL_DOCUMNET_STATUS);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [displayErrorMessage, setDisplayErrorMessage] =
    useState<boolean>(false);

  const { isLoading: isDownloadLoading, mutateAsync: downloadRISReportAsync } =
    useDownloadReportRIS();

  const downloadReportRIS = async (): Promise<void> => {
    if (!from || !to) {
      setErrorMessage('Date range of date scanned must be selected');
      setDisplayErrorMessage(true);
    }

    if (from && to) {
      if (from > to) {
        setErrorMessage('Incorrect date range of date scanned');
        setDisplayErrorMessage(true);
        return;
      }

      const risParams = await downloadRISReportAsync({
        username,
        from,
        to,
        currentPage,
        pageSize,
      });

      downloadFile({
        file: risParams,
        filename: `RIS_Report_${getCurrentDate()}.xlsx`,
      });
    }
  };

  const getCurrentDate = (): string => {
    return moment().format(DEFAULT_DATE_FORMAT);
  };

  const changeSortRIS = (sorterResult?: SorterResult): void => {
    setSorter(sorterResult ?? DEFAULT_SORT_ORDER_RIS_REPORT);
  };

  const renderColumnsRIS = (): TableColumnProps<RISReport>[] => [
    {
      title: 'Date Indexed',
      dataIndex: 'dateIndexed',
      render: ({ dateIndexed }: RISReport) =>
        moment(dateIndexed).format(DEFAULT_DATE_FORMAT),
      sorter: sortDateTime('dateIndexed'),
      sortOrder: sorter?.field === 'dateIndexed' ? sorter.order : undefined,
    },
    {
      title: 'File name',
      dataIndex: 'fileName',
    },
    {
      title: 'Scanner',
      dataIndex: 'scannerUsername',
    },
    {
      title: 'Size',
      dataIndex: 'fileSize',
      render: (document: RISReport) => fileSize(document.fileSize),
    },
  ];

  const parseDocumentType = (strDocumentType: string): DocTypeRIS => {
    return JSON.parse(strDocumentType).response[0] as DocTypeRIS;
  };

  const {
    isFetching,
    isLoading,
    isError: hasDocsError,
    data: result,
  } = useReportRIS({
    currentPage,
    pageSize,
    from,
    to,
    username,
    statuses: status,
    nomenclature,
  });

  const { ris, risTotal, risIndexes } = useMemo(
    () => ({
      ris: result?.data ?? [],
      risTotal: result?.count ?? 0,
      risIndexes: result?.data.map(({ indexes }) => parseDocumentType(indexes)),
    }),
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
      <div className="d-flex justify-content-between align-items-center flex-wrap my-1">
        <Stack direction="horizontal" gap={3} className="m-1">
          <DocumentStatusDropdown onChange={setStatus} />
          <NomenclatureDropdown
            onChange={setNomenclature}
            indexes={risIndexes}
            value={nomenclature}
            isLoading={isLoading}
            isError={hasDocsError}
          />
        </Stack>
        <Button
          className="mb-1"
          disabled={isDownloadLoading}
          variant="outline-secondary"
          onClick={downloadReportRIS}
        >
          Download
        </Button>
      </div>
      <Table<RISReport>
        isServerSide
        rowKey={(doc) => doc.documentId}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumnsRIS()}
        data={ris}
        pagination={{
          total: risTotal,
          pageSize,
          current: currentPage,
          pageNumber: 5,
          onChange: (page) => {
            setCurrentPage(page);
          },
          onSizeChange: setPageSize,
        }}
        onChange={changeSortRIS}
      />
    </div>
  );
};

export default RISReportTable;
