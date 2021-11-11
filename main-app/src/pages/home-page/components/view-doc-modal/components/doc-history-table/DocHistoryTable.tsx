import { ReactElement, useState } from 'react';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocumentHistory } from 'hooks';
import {
  Table,
  TableColumnProps,
  SorterResult,
  OrderDirection,
} from 'core/ui/table';
import { sortDateTime } from 'utils/sort';
import { DocumentHistory } from 'models';

export interface DocHistoryTableProps {
  documentId?: number;
}

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'createdDate',
  order: OrderDirection.DESC,
};

export const DocHistoryTable = ({
  documentId,
}: DocHistoryTableProps): ReactElement => {
  const [sorter, setSorter] = useState<SorterResult | undefined>(
    DEFAULT_SORT_ORDER,
  );
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
      sorter: sortDateTime('createdDate'),
      sortOrder: sorter?.field === 'createdDate' ? sorter.order : undefined,
    },
  ];

  const changeSort = (sorterResult?: SorterResult): void => {
    setSorter(sorterResult ?? DEFAULT_SORT_ORDER);
  };

  return (
    <Table<DocumentHistory>
      rowKey={(doc) => doc.id}
      loading={isLoading}
      isError={isError}
      columns={renderColumns()}
      data={documentHistory}
      onChange={changeSort}
    />
  );
};

export default DocHistoryTable;
