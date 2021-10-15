import { ReactElement, useState } from 'react';
import BTable from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortAlphaDown,
  faSortAlphaUp,
} from '@fortawesome/free-solid-svg-icons';
import styles from './Table.module.scss';
import { TableProps, Sorter } from './Table.types';
import { Pagination, SearchField } from './components';

export const Table = <T extends Record<string, any> = {}>(
  props: TableProps<T>,
): ReactElement => {
  const [sorter, setSorter] = useState<Sorter | undefined>(undefined);
  const {
    rowKey,
    loading,
    isError,
    columns,
    data,
    pagination,
    searchKey,
    selectedRow,
    onSelectRow,
    onChange,
    onSearch,
  } = props;
  const rowCount = data.length;

  const showRowHighlight = (rowData: T): string => {
    if (typeof rowKey === 'function' && selectedRow) {
      return rowKey(rowData) === rowKey(selectedRow)
        ? styles.highlightRow
        : styles.tableRow;
    } else if (typeof rowKey === 'string' && selectedRow) {
      return rowData[rowKey] === selectedRow[rowKey]
        ? styles.highlightRow
        : styles.tableRow;
    } else return styles.tableRow;
  };

  const setSelectedRow = (rowData: T): void => {
    if (onSelectRow && typeof onSelectRow === 'function')
      onSelectRow(selectedRow?.id === rowData.id ? undefined : rowData);
  };

  const triggerOnChange = (sorter?: Sorter): void => {
    if (onChange && typeof onChange === 'function') onChange(sorter);
    setSorter(sorter);
  };

  const renderSearchField = (): ReactElement | undefined => {
    if (searchKey !== undefined && onSearch && typeof onSearch === 'function')
      return <SearchField searchKey={searchKey} onSearchDocument={onSearch} />;
  };

  const renderTableColumns = (): ReactElement[] => {
    return columns.map(({ title, dataIndex, sorter: sorterConfig }, index) => {
      let newSorter: Sorter = { field: dataIndex, order: 'ASC', orderIndex: 0 };
      const isSelf = sorter?.field === newSorter.field;
      const isAsc = sorter?.order === 'ASC';
      return (
        <th
          key={index}
          className={styles.tableHeaderCol}
          onClick={() => {
            if (!sorterConfig) return;
            if (isSelf) {
              var currentSorter = { ...sorter };
              currentSorter.order = isAsc ? 'DESC' : 'ASC';
              currentSorter.orderIndex = ++currentSorter.orderIndex % 3;
              triggerOnChange(
                currentSorter.orderIndex < 2 ? currentSorter : undefined,
              );
            } else triggerOnChange(newSorter);
          }}
        >
          {title}{' '}
          {sorterConfig && (
            <FontAwesomeIcon
              icon={isSelf ? (isAsc ? faSortAlphaUp : faSortAlphaDown) : faSort}
            />
          )}
        </th>
      );
    });
  };

  const renderTable = (): ReactElement => {
    if (loading) {
      return (
        <div className="w-100 h-100 p-5 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      );
    }

    if (rowCount <= 0) {
      return (
        <Alert className="text-center" variant="light">
          No Data.
        </Alert>
      );
    }

    if (isError) {
      return (
        <Alert className="text-center" variant="danger">
          Could not load data, Please try again.
        </Alert>
      );
    }

    return (
      <div className={styles.tableContainer}>
        <BTable bordered hover>
          <thead className={styles.tableTHead}>
            <tr>{renderTableColumns()}</tr>
          </thead>
          <tbody>
            {data.map((data, index) => (
              <tr
                key={index}
                className={showRowHighlight(data)}
                onClick={() => setSelectedRow(data)}
              >
                {columns.map(({ dataIndex, render }, index) => (
                  <td key={index}>
                    {(render && render(data)) || data[dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </BTable>
      </div>
    );
  };

  const renderPagination = (): ReactElement | undefined => {
    if (pagination && typeof pagination === 'object') {
      const { total, pageSize, current, pageNumber, onChange, onSizeChange } =
        pagination;
      return (
        <Pagination
          isLoading={loading}
          total={total}
          rowCount={rowCount}
          pageSize={pageSize}
          currentPage={current}
          paginationNumber={pageNumber}
          onPageChanged={onChange}
          onSizeChange={onSizeChange}
        />
      );
    }
  };

  return (
    <>
      {renderSearchField()}
      {renderTable()}
      {renderPagination()}
    </>
  );
};

export default Table;
