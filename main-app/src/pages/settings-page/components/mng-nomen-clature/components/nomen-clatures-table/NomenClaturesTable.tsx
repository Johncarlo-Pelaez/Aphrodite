import { ReactElement, useState } from 'react';
import { useNomenClatures } from 'hooks';
import { Table, TableColumnProps } from 'core/ui/table';
import { NomenClature } from 'models';
import { NomenClaturesTableProps } from './NomenClaturesTable.types';

const columns: TableColumnProps<NomenClature>[] = [
  {
    title: 'Description',
    dataIndex: 'description',
  },
];

export const NomenClaturesTable = ({
  selectedNomenClature,
  onSelectNomenClature,
}: NomenClaturesTableProps): ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const { isLoading, isError, data: nomenClatures = [] } = useNomenClatures();

  const total = nomenClatures.length;

  return (
    <Table<NomenClature>
      rowKey={(doc) => doc.id}
      loading={isLoading}
      isError={isError}
      columns={columns}
      data={nomenClatures}
      pagination={{
        total: total,
        pageSize: pageSize,
        current: currentPage,
        pageNumber: 5,
        onChange: setCurrentPage,
        onSizeChange: setPageSize,
      }}
      selectedRow={selectedNomenClature}
      onSelectRow={onSelectNomenClature}
    />
  );
};

export default NomenClaturesTable;
