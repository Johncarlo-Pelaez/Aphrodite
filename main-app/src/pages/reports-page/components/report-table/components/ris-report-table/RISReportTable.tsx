import { ReactElement, useState, useMemo, useEffect } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { Button, Toast } from 'react-bootstrap';
import { Stack } from 'react-bootstrap';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useReportRIS, useDownloadReportRIS } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { RISReport } from 'models';
import { downloadFile } from 'utils';
import { sortDateTime } from 'utils/sort';
import { NomenclatureDropdown, DocTypeRIS } from './components';
import { getDocStatusFilter } from 'pages/home-page';
import {
  StatusDropdown,
  OperationOption,
  OperationDropdown,
  StatusOption,
} from 'pages/home-page/components';

const DEFAULT_SORT_ORDER_RIS_REPORT: SorterResult = {
  field: 'dateIndexed',
  order: SortOrder.DESC,
};

export interface RISReportTableProps {
  username?: string;
  from?: Date;
  to?: Date;
}

export interface GetIndexesResult {
  response: DocTypeRIS[];
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [displayErrorMessage, setDisplayErrorMessage] =
    useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusOption>(
    StatusOption.ALL,
  );
  const [selectedOperation, setSelectedOperation] = useState<OperationOption>(
    OperationOption.ALL,
  );

  const [status, setStatus] = useState<StatusOption | undefined>(undefined);
  const [operation, setOperation] = useState<OperationOption | undefined>(
    undefined,
  );
  const [docType, setDocType] = useState<string | undefined>(undefined);

  let documentStatusFilter = getDocStatusFilter(status, operation);

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
        statuses: documentStatusFilter,
        nomenclature,
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

  const parseDocumentType = (
    strDocumentType: string,
  ): DocTypeRIS | undefined => {
    const sample: GetIndexesResult | undefined =
      !!strDocumentType && strDocumentType !== ''
        ? JSON.parse(strDocumentType)
        : undefined;
    return !!sample?.response?.length ? sample.response[0] : undefined;
  };

  const collectFilters = () => {
    setStatus(selectedStatus);
    setOperation(selectedOperation);
    setDocType(nomenclature);
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
    statuses: documentStatusFilter,
    nomenclature: docType,
  });

  const { ris, risTotal, risIndexes } = useMemo(
    () => ({
      ris: result?.data ?? [],
      risTotal: result?.count ?? 0,
      risIndexes: result?.data.map(({ indexes }) => parseDocumentType(indexes)),
    }),
    [result?.data, result?.count],
  );

  useEffect(() => {
    return () => {
      setCurrentPage(1);
      setPageSize(15);
      setSorter(DEFAULT_SORT_ORDER_RIS_REPORT);
      setNomenclature(undefined);
      setErrorMessage('');
      setDisplayErrorMessage(false);
      setSelectedStatus(StatusOption.ALL);
      setSelectedOperation(OperationOption.ALL);

      if (username || from || to) {
        setStatus(undefined);
        setOperation(undefined);
        setDocType(undefined);
      }
    };
  }, [from, to, username]);

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
        <Stack direction="horizontal" gap={3}>
          <StatusDropdown
            selectedOperation={selectedOperation}
            selected={selectedStatus}
            onChange={setSelectedStatus}
          />
          <OperationDropdown
            selected={selectedOperation}
            onChange={setSelectedOperation}
          />
          <NomenclatureDropdown
            onChange={setNomenclature}
            indexes={risIndexes}
            value={nomenclature}
            isLoading={isLoading}
            isError={hasDocsError}
          />
          <Button variant="outline-secondary" onClick={collectFilters}>
            Select
          </Button>
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
