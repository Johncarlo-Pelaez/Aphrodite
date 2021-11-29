import { ReactElement, useState, useEffect } from 'react';
import { useNomenclaturesWhitelist } from 'hooks';
import { Table, TableColumnProps } from 'core/ui/table';
import { NomenclatureWhitelist } from 'models';

const columns: TableColumnProps<NomenclatureWhitelist>[] = [
  {
    title: 'Nomenclature',
    dataIndex: 'description',
  },
];

export interface WhitelistTableProps {
  selectedWhitelist?: NomenclatureWhitelist;
  onSelectWhitelist: (nomenClature?: NomenclatureWhitelist) => void;
}

export const WhitelistTable = ({
  selectedWhitelist,
  onSelectWhitelist: triggerSelectWhitelist,
}: WhitelistTableProps): ReactElement => {
  const [searchKey, setSearchKey] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const {
    isLoading,
    isError,
    data: whitelists = [],
  } = useNomenclaturesWhitelist();
  const total = whitelists.length;

  const handleSelectRow = (selected: NomenclatureWhitelist): void => {
    triggerSelectWhitelist(
      selected.id === selectedWhitelist?.id ? undefined : selected,
    );
  };

  useEffect(
    function removeOutOfRangeSelectedRow() {
      const start = (currentPage - 1) * pageSize;
      const end = currentPage * pageSize;
      const pageKeys = whitelists.slice(start, end).map((l) => l.id);
      if (!pageKeys.some((k) => k === selectedWhitelist?.id))
        triggerSelectWhitelist(undefined);
    },
    // eslint-disable-next-line
    [currentPage, pageSize, whitelists, selectedWhitelist],
  );

  return (
    <Table<NomenclatureWhitelist>
      rowKey={(doc) => doc.id}
      loading={isLoading}
      isError={isError}
      columns={columns}
      data={whitelists}
      pagination={{
        total: total,
        pageSize: pageSize,
        current: currentPage,
        pageNumber: 5,
        onChange: setCurrentPage,
        onSizeChange: setPageSize,
      }}
      selectedRow={selectedWhitelist}
      onSelectRow={handleSelectRow}
      searchKey={searchKey}
      onSearch={setSearchKey}
    />
  );
};

export default WhitelistTable;
