import { ReactElement } from 'react';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocumentHistory } from 'hooks';
import { Table, TableColumnProps } from 'core/ui/table';
import { DocumentHistory } from 'models';

export interface DocHistoryTableProps {
  documentId?: number;
}

export const DocHistoryTable = ({
  documentId,
}: DocHistoryTableProps): ReactElement => {
  const {
    isLoading,
    isError,
    data: documentHistory = [],
  } = useDocumentHistory(documentId);

  const renderColumns = (): TableColumnProps<DocumentHistory>[] => [
    {
      title: 'Filename',
      render: (docHistory: DocumentHistory) =>
        `${docHistory.document.documentName}`,
    },
    {
      title: 'Version',
      render: () => '1.0',
    },
    {
      title: 'User',
      dataIndex: 'user',
      render: (docHistory: DocumentHistory) =>
        `${docHistory.user.firstName} ${docHistory.user.lastName}`,
    },
    {
      title: 'Activity',
      dataIndex: 'user',
      render: (docHistory: DocumentHistory) => docHistory.description,
    },
    {
      title: 'Date and Time',
      dataIndex: 'createdDate',
      render: (document: DocumentHistory) =>
        moment(document.createdDate).format(DEFAULT_DATE_FORMAT),
    },
  ];

  return (
    <Table<DocumentHistory>
      rowKey={(doc) => doc.id}
      loading={isLoading}
      isError={isError}
      columns={renderColumns()}
      data={documentHistory}
    />
  );
};

export default DocHistoryTable;
