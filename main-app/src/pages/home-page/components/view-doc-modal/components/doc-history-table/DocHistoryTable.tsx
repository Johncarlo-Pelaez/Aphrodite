import { ReactElement, useState } from 'react';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { useDocumentHistory } from 'hooks';
import {
  Table,
  TableColumnProps,
  SorterResult,
  SortOrder,
} from 'core/ui/table';
import { sortDateTime } from 'utils/sort';
import { DocumentHistory } from 'models';
import { DocumentStatus } from 'core/enum';

export interface DocHistoryTableProps {
  documentId?: number;
}

const DEFAULT_SORT_ORDER: SorterResult = {
  field: 'createdDate',
  order: SortOrder.DESC,
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
      dataIndex: 'userUsername',
    },
    {
      title: 'Activity',
      dataIndex: 'description',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      render: (docHistory: DocumentHistory) => {
        if (
          docHistory.documentStatus === DocumentStatus.MIGRATE_FAILED &&
          docHistory.note !== undefined &&
          docHistory.note !== ''
        ) {
          let springcmRes: any;
          try {
            springcmRes = JSON.parse(docHistory.note);
          } catch (err) {
            return docHistory.note ?? '';
          }

          if (
            !!springcmRes?.SalesForce?.length &&
            springcmRes?.SalesForce[0]?.success === 'false' &&
            !!springcmRes?.SalesForce[0]?.errors?.length &&
            springcmRes?.SalesForce[0]?.errors[0]?.statusCode ===
              'CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY'
          ) {
            return 'Successfully uploaded document to SpringCM but error in updating Checklist line item status';
          } else if (
            !!springcmRes?.SalesForce?.length &&
            springcmRes?.SalesForce[0]?.success === 'false' &&
            !!springcmRes?.SalesForce[0]?.errors?.length &&
            springcmRes?.SalesForce[0]?.errors[0]?.statusCode !==
              'CANNOT_INSERT_UPDATE_ACTIVATE_ENTITY'
          ) {
            return springcmRes?.SalesForce[0]?.errors[0]?.message;
          }

          const activityName = springcmRes?.faultInfo?.activityName;
          if (activityName === 'Set SpringCM Attributes') {
            return 'With incomplete attributes';
          } else if (activityName === 'Get Folder Access') {
            return 'Get Folder Access error';
          } else {
            return (
              springcmRes?.faultInfo?.message ??
              springcmRes?.faultInfo?.activityName
            );
          }
        } else return docHistory.note ?? '';
      },
    },
    {
      title: 'Date and Time',
      dataIndex: 'createdDate',
      render: (docHistory: DocumentHistory) =>
        moment(docHistory.createdDate).format(DEFAULT_DATE_FORMAT),
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
