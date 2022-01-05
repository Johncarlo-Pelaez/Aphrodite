import {
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { DocumentStatus } from 'core/enum';
import { useDebounce, useDocuments } from 'hooks';
import { Table, TableColumnProps, SorterResult, SortOrder } from 'core/ui';
import { Document } from 'models';
import { sortDateTime, sortText } from 'utils/sort';
import { parseDocumentType } from '../view-doc-modal/components';
import {
  generateOperationText,
  generateStatusText,
} from './DocumentTable.utils';

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'modifiedDate',
  order: SortOrder.DESC,
};

export interface DataFilterProps {
  searchKey: string;
  statuses: DocumentStatus[];
  dateFrom?: Date;
  dateTo?: Date;
  username?: string;
}

export interface DocumentsTableProps {
  selectedDocuments: Document[];
  dataFilters?: DataFilterProps;
  setSelectedDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  onDoubleClickRow: () => void;
}

export const DocumentsTable = forwardRef(
  (props: DocumentsTableProps, ref): ReactElement => {
    const {
      selectedDocuments,
      dataFilters,
      setSelectedDocuments,
      onDoubleClickRow: triggerDoubleClickRow,
    } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(15);
    const [sorter, setSorter] = useState<SorterResult | undefined>(
      DEFAULT_SORT_ORDER,
    );
    const selectedDocumentKeys = selectedDocuments.map((d) => d.id);
    const searchKey = dataFilters?.searchKey ?? '';
    const statuses = dataFilters?.statuses ?? [];
    const dateFrom = dataFilters?.dateFrom;
    const dateTo = dataFilters?.dateTo;
    const username = dataFilters?.username;
    const debouncedSearch = useDebounce(searchKey);

    const {
      isFetching,
      isLoading,
      isError: hasDocsError,
      data: result,
      refetch,
    } = useDocuments({
      search: debouncedSearch,
      currentPage,
      pageSize,
      statuses,
      dateFrom,
      dateTo,
      username,
    });

    const { documents, total } = useMemo(
      () => ({ documents: result?.data ?? [], total: result?.count ?? 0 }),
      [result?.data, result?.count],
    );
    const selectedIndexes = useMemo(() => {
      return selectedDocuments.reduce(
        (indexes: number[], current: Document) => {
          indexes.push(documents.findIndex((d) => d.id === current.id));
          return indexes;
        },
        [],
      );
    }, [documents, selectedDocuments]);

    const renderColumns = (): TableColumnProps<Document>[] => [
      {
        title: 'Name',
        dataIndex: 'documentName',
        sorter: sortText('documentName'),
        sortOrder: sorter?.field === 'documentName' ? sorter.order : undefined,
      },
      {
        title: 'Size',
        dataIndex: 'documentSize',
        render: (document: Document) => fileSize(document.documentSize),
      },
      {
        title: 'Document Type',
        dataIndex: '',
        render: (document: Document) => {
          const documentType = parseDocumentType(document.documentType ?? '');
          return documentType ? documentType.Nomenclature : '';
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        render: (document: Document) => {
          const statusText = generateStatusText(document.status);
          return (
            <span style={{ color: statusText === 'Error' ? 'red' : 'black' }}>
              {statusText}
            </span>
          );
        },
      },
      {
        title: 'Operation',
        dataIndex: 'status',
        render: (document: Document) => {
          return generateOperationText(document.status);
        },
      },
      {
        title: 'User',
        dataIndex: 'user',
        render: (document: Document) =>
          `${document.user.firstName} ${document.user.lastName}`,
      },
      {
        title: 'Date Modified',
        dataIndex: 'modifiedDate',
        render: (document: Document) =>
          moment(document.modifiedDate).format(DEFAULT_DATE_FORMAT),
        sorter: sortDateTime('modifiedDate'),
        sortOrder: sorter?.field === 'modifiedDate' ? sorter.order : undefined,
      },
    ];

    const changeSort = (sorterResult?: SorterResult): void => {
      setSorter(sorterResult ?? DEFAULT_SORT_ORDER);
    };

    const changeSelectedRows = (
      selectedRowKeys: React.Key[],
      selectedRows: Document[],
    ) => {
      setSelectedDocuments(selectedRows);
    };

    const selectNextDocument = useCallback(() => {
      const nextIndex = (Math.max(...selectedIndexes) + 1) % documents.length;
      const nextDocument = documents[nextIndex];
      if (nextDocument) {
        setSelectedDocuments([nextDocument]);
      }
      // eslint-disable-next-line
    }, [selectedIndexes, documents]);

    useImperativeHandle(
      ref,
      () => ({
        refresh: refetch,
        next: selectNextDocument,
      }),
      // eslint-disable-next-line
      [selectNextDocument],
    );

    useEffect(() => {
      const pageDocKeys = documents.map((d): React.Key => d.id);
      setSelectedDocuments((current) =>
        current.filter((d) => pageDocKeys.includes(d.id)),
      );
    }, [documents, currentPage, pageSize, setSelectedDocuments]);

    return (
      <Table<Document>
        isServerSide
        rowKey={(doc) => doc.id}
        loading={isLoading || isFetching}
        isError={hasDocsError}
        columns={renderColumns()}
        data={documents}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedDocumentKeys,
          onChange: changeSelectedRows,
        }}
        pagination={{
          total: total,
          pageSize: pageSize,
          current: currentPage,
          pageNumber: 5,
          onChange: (page) => {
            setCurrentPage(page);
            setSelectedDocuments([]);
          },
          onSizeChange: setPageSize,
        }}
        onSelectRow={(document) => {
          const isSelected = selectedDocuments.some(
            (d) => d.id === document.id,
          );
          if (isSelected) {
            setSelectedDocuments((current) =>
              current.filter((d) => d.id !== document.id),
            );
          } else {
            setSelectedDocuments((current) => [...current, document]);
          }
        }}
        onChange={changeSort}
        onDoubleClickRow={triggerDoubleClickRow}
      />
    );
  },
);

export default DocumentsTable;
