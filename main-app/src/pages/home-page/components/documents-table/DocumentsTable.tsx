import { ReactElement, useState } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocuments } from 'hooks/document';
import { useDebounce } from 'hooks/debounce';
import { Table, TableColumnProps } from 'core/ui/table';
import { Document } from 'models';

const columns: TableColumnProps<Document>[] = [
  { title: 'Name', dataIndex: 'documentName' },
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
    sorter: true,
  },
];

export const DocumentsTable = (): ReactElement => {
  const [selectedDocument, setSelectedDocument] = useState<
    Document | undefined
  >(undefined);
  const [searchKey, setSearchKey] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
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

  const documents = result?.data || [];
  const total = result?.count || 0;

  return (
    <Table<Document>
      rowKey={(doc) => doc.id}
      loading={isDocsLoading}
      isError={hasDocsError}
      columns={columns}
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
      selectedRow={selectedDocument}
      onSelectRow={setSelectedDocument}
      onSearch={setSearchKey}
    />
  );
};

export default DocumentsTable;
