import { ReactElement, useState } from 'react';
import { useNomenclatures } from 'hooks';
import { Table, TableColumnProps } from 'core/ui/table';
import { Nomenclature } from 'models';

const columns: TableColumnProps<Nomenclature>[] = [
  {
    title: 'Description',
    dataIndex: 'description',
  },
];

export interface NomenclaturesTableProps {
  selectedNomenclature?: Nomenclature;
  onSelectNomenclature: (nomenClature?: Nomenclature) => void;
}

export const NomenclaturesTable = ({
  selectedNomenclature,
  onSelectNomenclature,
}: NomenclaturesTableProps): ReactElement => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const { isLoading, isError, data: nomenClatures = [] } = useNomenclatures();
  const total = nomenClatures.length;

  return (
    <Table<Nomenclature>
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
      selectedRow={selectedNomenclature}
      onSelectRow={onSelectNomenclature}
    />
  );
};

export default NomenclaturesTable;
