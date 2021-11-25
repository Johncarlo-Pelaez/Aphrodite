import {
  ReactElement,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { DocumentStatus } from 'core/enum';
import { useDebounce, useDocuments } from 'hooks';
import {
  Table,
  TableColumnProps,
  SorterResult,
  OrderDirection,
} from 'core/ui/table';
import { Document } from 'models';
import { sortDateTime, sortText } from 'utils/sort';
import { parseDocumentType } from '../view-doc-modal/components';

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'modifiedDate',
  order: OrderDirection.DESC,
};

export interface DocumentsTableProps {
  selectedDocuments: Document[];
  selectedDocumentKeys: number[];
  filterDocStatus: DocumentStatus[];
  setSelectedDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  setSelectedDocumentKeys: React.Dispatch<React.SetStateAction<number[]>>;
}

export const DocumentsTable = forwardRef(
  (props: DocumentsTableProps, ref): ReactElement => {
    const {
      selectedDocuments,
      selectedDocumentKeys,
      filterDocStatus,
      setSelectedDocuments,
      setSelectedDocumentKeys,
    } = props;
    const [searchKey, setSearchKey] = useState<string>('');
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
                return 'Error';
              case 'DONE':
                return 'Success';
            }
          } else return 'Waiting';
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

    useImperativeHandle(ref, () => ({
      refresh: refetch,
    }));

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
        searchKey={searchKey}
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
        onSearch={setSearchKey}
        onChange={changeSort}
      />
    );
  },
);

export default DocumentsTable;
