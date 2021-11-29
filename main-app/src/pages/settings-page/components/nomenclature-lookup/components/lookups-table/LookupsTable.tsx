import { ReactElement, useState, useEffect } from 'react';
import { useNomenclatureLookups } from 'hooks';
import { Table, TableColumnProps } from 'core/ui/table';
import { nomenclatureLookup } from 'models';

const columns: TableColumnProps<nomenclatureLookup>[] = [
  {
    title: 'Nomenclature',
    dataIndex: 'nomenclature',
  },
  {
    title: 'Document Group',
    dataIndex: 'documentGroup',
  },
];

export interface LookupsTableProps {
  selectedLookup?: nomenclatureLookup;
  onSelectLookup: (nomenclature?: nomenclatureLookup) => void;
}

export const LookupsTable = ({
  selectedLookup,
  onSelectLookup: triggerSelectLookup,
}: LookupsTableProps): ReactElement => {
  const [searchKey, setSearchKey] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const { isLoading, isError, data: lookups = [] } = useNomenclatureLookups();
  const total = lookups.length;

  const handleSelectRow = (selected: nomenclatureLookup): void => {
    triggerSelectLookup(
      selected.id === selectedLookup?.id ? undefined : selected,
    );
  };

  useEffect(
    function removeOutOfRangeSelectedRow() {
      const start = (currentPage - 1) * pageSize;
      const end = currentPage * pageSize;
      const pageKeys = lookups.slice(start, end).map((l) => l.id);
      if (!pageKeys.some((k) => k === selectedLookup?.id))
        triggerSelectLookup(undefined);
    },
    // eslint-disable-next-line
    [currentPage, pageSize, lookups, selectedLookup],
  );

  return (
    <Table<nomenclatureLookup>
      rowKey={(doc) => doc.id}
      loading={isLoading}
      isError={isError}
      columns={columns}
      data={lookups}
      pagination={{
        total: total,
        pageSize: pageSize,
        current: currentPage,
        pageNumber: 5,
        onChange: setCurrentPage,
        onSizeChange: setPageSize,
      }}
      selectedRow={selectedLookup}
      onSelectRow={handleSelectRow}
      searchKey={searchKey}
      onSearch={setSearchKey}
    />
  );
};

export default LookupsTable;
