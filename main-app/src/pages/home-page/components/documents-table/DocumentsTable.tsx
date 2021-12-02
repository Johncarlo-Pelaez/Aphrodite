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

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'modifiedDate',
  order: SortOrder.DESC,
};

export interface DocumentsTableProps {
  searchKey: string;
  selectedDocuments: Document[];
  selectedDocumentKeys: number[];
  filterDocStatus: DocumentStatus[];
  setSelectedDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  setSelectedDocumentKeys: React.Dispatch<React.SetStateAction<number[]>>;
}

export const DocumentsTable = forwardRef(
  (props: DocumentsTableProps, ref): ReactElement => {
    const {
      searchKey,
      selectedDocuments,
      selectedDocumentKeys,
      filterDocStatus,
      setSelectedDocuments,
      setSelectedDocumentKeys,
    } = props;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(15);
    const [sorter, setSorter] = useState<SorterResult | undefined>(
      DEFAULT_SORT_ORDER,
    );
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
      statuses: filterDocStatus,
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
          const arrStatus = document.status.split('_');
          if (arrStatus.length === 2) {
            const status = arrStatus[1];
            switch (status) {
              case 'BEGIN':
                return 'Processing';
              case 'FAILED':
                return <span style={{ color: 'red' }}>Error</span>;
              case 'DONE':
                return 'Success';
            }
          } else if (arrStatus[0] === DocumentStatus.CANCELLED)
            return 'Cancelled';
          else return 'Waiting';
        },
      },
      {
        title: 'Operation',
        dataIndex: 'status',
        render: (document: Document) => {
          const arrStatus = document.status.split('_');
          const operation = arrStatus[0];
          switch (operation) {
            case 'INDEXING':
              return 'Index';
            case DocumentStatus.CANCELLED:
              return '';
            default:
              return (
                operation.charAt(0).toUpperCase() +
                operation.slice(1).toLowerCase()
              );
          }
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
      setSelectedDocumentKeys(selectedRowKeys as number[]);
    };

    const selectNextDocument = useCallback(() => {
      const nextIndex = (Math.max(...selectedIndexes) + 1) % documents.length;
      const nextDocument = documents[nextIndex];
      if (nextDocument) {
        setSelectedDocuments([nextDocument]);
        setSelectedDocumentKeys([nextDocument.id]);
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
      setSelectedDocumentKeys((current) =>
        current.filter((key) => pageDocKeys.includes(key)),
      );
    }, [
      documents,
      currentPage,
      pageSize,
      setSelectedDocuments,
      setSelectedDocumentKeys,
    ]);

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
            setSelectedDocumentKeys((current) =>
              current.filter((key) => key !== document.id),
            );
          } else {
            setSelectedDocuments((current) => [...current, document]);
            setSelectedDocumentKeys((current) => [...current, document.id]);
          }
        }}
        onChange={changeSort}
      />
    );
  },
);

export default DocumentsTable;
