import { ReactElement, useState } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocuments } from 'hooks/document';
import { useDebounce } from 'hooks/debounce';
import {
  Table,
  TableColumnProps,
  SorterResult,
  OrderDirection,
} from 'core/ui/table';
import { Document } from 'models';
import { sortDateTime, sortText } from 'utils/sort';
import { DocumentsTableProps } from './DocumentsTable.types';

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'modifiedDate',
  order: OrderDirection.DESC,
};

export const DocumentsTable = ({
  selectedDoc,
  onSelectDoc,
}: DocumentsTableProps): ReactElement => {
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
    searchKey: debouncedSearch,
    currentPage,
    pageSize,
  });

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

  const documents = result?.data || [];
  const total = result?.count || 0;

  return (
    <Table<Document>
      isServerSide
      rowKey={(doc) => doc.id}
      loading={isDocsLoading}
      isError={hasDocsError}
      columns={renderColumns()}
      data={documents}
      pagination={{
        total: total,
        pageSize: pageSize,
        current: currentPage,
        pageNumber: 5,
        onChange: setCurrentPage,
        onSizeChange: setPageSize,
      }}
      searchKey={searchKey}
      selectedRow={selectedDoc}
      onSelectRow={onSelectDoc}
      onSearch={setSearchKey}
      onChange={changeSort}
    />
  );
};

export default DocumentsTable;
