import { ReactElement, useState, useEffect, useMemo } from 'react';
import { useNomenclatureLookups } from 'hooks';
import { Table, TableColumnProps } from 'core/ui';
import { nomenclatureLookup } from 'models';
import { Card } from 'react-bootstrap';

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
  searchKey: string;
  selectedLookup?: nomenclatureLookup;
  onSelectLookup: (nomenclature?: nomenclatureLookup) => void;
}

export const LookupsTable = (props: LookupsTableProps): ReactElement => {
  const {
    searchKey,
    selectedLookup,
    onSelectLookup: triggerSelectLookup,
  } = props;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const { isLoading, isError, data = [] } = useNomenclatureLookups();
  const { lookups, total } = useMemo(() => {
    let lookups = data;
    if (searchKey)
      lookups = lookups?.filter((data: nomenclatureLookup) =>
        Object.values(data).some((value) =>
          value?.toString().toLowerCase().includes(searchKey.toLowerCase()),
        ),
      );
    const total = lookups.length;
    return { lookups, total };
  }, [data, searchKey]);

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
    <Card>
      <Card.Body className="p-1 m-1 display-fixed">
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
        />
      </Card.Body>
    </Card>
  );
};

export default LookupsTable;
