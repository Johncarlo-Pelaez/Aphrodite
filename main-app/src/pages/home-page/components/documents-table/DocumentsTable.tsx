import { ReactElement, useState } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDebounce, useDocuments } from 'hooks';
import {
  Table,
  TableColumnProps,
  SorterResult,
  OrderDirection,
} from 'core/ui/table';
import { Document } from 'models';
import { sortDateTime, sortText } from 'utils/sort';

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'modifiedDate',
  order: OrderDirection.DESC,
};

export interface DocumentsTableProps {
  selectedDocuments: Document[];
  setSelectedDocuments: (document: Document[]) => void;
}

export const DocumentsTable = (props: DocumentsTableProps): ReactElement => {
  const { selectedDocuments, setSelectedDocuments } = props;
  const [searchKey, setSearchKey] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [sorter, setSorter] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER,
  );
  const debouncedSearch = useDebounce(searchKey);

  const {
    isLoading: isDocsLoading,
    isError: hasDocsError,
    data: result,
  } = useDocuments({
    search: debouncedSearch,
    currentPage,
    pageSize,
  });

  const documents = result?.data || [];
  const total = result?.count || 0;

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

  return (
    <Table<Document>
      isServerSide
      rowKey={(doc) => doc.id}
      loading={isDocsLoading}
      isError={hasDocsError}
      columns={renderColumns()}
      data={documents}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: selectedDocuments.map((doc) => doc.id),
        onChange: changeSelectedRows,
      }}
      pagination={{
        total: total,
        pageSize: pageSize,
        current: currentPage,
        pageNumber: 5,
        onChange: setCurrentPage,
        onSizeChange: setPageSize,
      }}
      searchKey={searchKey}
      onSelectRow={(document) => {
        let newSelectedDocs: Document[] = [];
        const isSelected = selectedDocuments.some((d) => d.id === document.id);
        if (isSelected) {
          newSelectedDocs = selectedDocuments.filter(
            (d) => d.id !== document.id,
          );
        } else {
          newSelectedDocs = [...selectedDocuments, document];
        }
        setSelectedDocuments(newSelectedDocs);
      }}
      onSearch={setSearchKey}
      onChange={changeSort}
    />
  );
};

export default DocumentsTable;
