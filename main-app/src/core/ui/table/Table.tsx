import { ReactElement, useState, useEffect } from 'react';
import BTable from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSort,
  faSortAlphaDown,
  faSortAlphaUp,
} from '@fortawesome/free-solid-svg-icons';
import { TableProps, SorterResult, TableColumnProps } from './Table.types';
import { OrderDirection } from './Table.enum';
import { Pagination, SearchField } from './components';

export const Table = <T extends Record<string, any> = {}>(
  props: TableProps<T>,
): ReactElement => {
  const [defaultSorter, setDefaultSorter] = useState<SorterResult | undefined>(
    undefined,
  );
  const [currentColumnSorter, setCurrentColumnSorter] =
    useState<TableColumnProps<T> | null>(null);
  const [dataList, setDataList] = useState<T[]>([]);
  const {
    isServerSide,
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
  const sortOrderSequence = [
    OrderDirection.ASC,
    OrderDirection.DESC,
    undefined,
  ];

  const showRowHighlight = (rowData: T): string => {
    if (typeof rowKey === 'function' && selectedRow) {
      return rowKey(rowData) === rowKey(selectedRow) ? 'highlight-row' : '';
    } else if (typeof rowKey === 'string' && selectedRow) {
      return rowData[rowKey] === selectedRow[rowKey] ? 'highlight-row' : '';
    } else return '';
  };

  const setSelectedRow = (rowData: T): void => {
    if (onSelectRow && typeof onSelectRow === 'function')
      onSelectRow(selectedRow?.id === rowData.id ? undefined : rowData);
  };

  const triggerOnChange = (sorter?: SorterResult): void => {
    if (onChange && typeof onChange === 'function') onChange(sorter);
  };

  const renderSearchField = (): ReactElement | undefined => {
    if (searchKey !== undefined && onSearch && typeof onSearch === 'function')
      return <SearchField searchKey={searchKey} onSearchDocument={onSearch} />;
  };

  const renderTableColumns = (): ReactElement[] => {
    return columns.map(({ title, dataIndex, sortOrder, sorter }, index) => {
      const sorterConfig =
        dataIndex && typeof sorter === 'function' && sortOrder;
      const isDefaultSorter = dataIndex === defaultSorter?.field;
      const isSelfCurrentSorter = currentColumnSorter?.dataIndex === dataIndex;
      const isAsc = sortOrder === OrderDirection.ASC;
      return (
        <th
          key={index}
          onClick={() => {
            if (!sorterConfig) return;
            let newSortOrder;
            if (isDefaultSorter) {
              if (
                defaultSorter?.order === sortOrder &&
                defaultSorter?.order &&
                sortOrder
              )
                newSortOrder = isAsc ? OrderDirection.DESC : OrderDirection.ASC;
              else if (!sortOrder) newSortOrder = defaultSorter?.order;
              else newSortOrder = undefined;
            } else {
              const nextSorterIndex =
                (sortOrderSequence.findIndex((od) => od === sortOrder) + 1) % 3;
              newSortOrder = sortOrderSequence[nextSorterIndex];
            }
            triggerOnChange(
              newSortOrder
                ? { field: dataIndex, order: newSortOrder }
                : undefined,
            );
          }}
        >
          {title}{' '}
          {sorterConfig && (
            <FontAwesomeIcon
              icon={
                isSelfCurrentSorter
                  ? isAsc
                    ? faSortAlphaUp
                    : faSortAlphaDown
                  : faSort
              }
            />
          )}
        </th>
      );
    });
  };

  const renderTable = (): ReactElement => {
    if (loading)
      return (
        <div className="b-table__spinner">
          <Spinner animation="border" />
        </div>
      );

    if (rowCount <= 0)
      return (
        <Alert className="text-center" variant="light">
          No Data.
        </Alert>
      );

    if (isError)
      return (
        <Alert className="text-center" variant="danger">
          Could not load data, Please try again.
        </Alert>
      );

    return (
      <div className="table-container">
        <BTable className="b-table" borderless hover>
          <thead>
            <tr>{renderTableColumns()}</tr>
          </thead>
          <tbody>
            {dataList.map((data, index) => (
              <tr
                key={index}
                className={showRowHighlight(data)}
                onClick={() => setSelectedRow(data)}
              >
                {columns.map(({ dataIndex, render }, index) => (
                  <td key={index}>
                    {typeof render === 'function'
                      ? render(data)
                      : (dataIndex && data && data[dataIndex]) || ''}
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
    if (pagination && typeof pagination === 'object')
      return (
        <Pagination
          isLoading={loading}
          total={pagination.total}
          rowCount={rowCount}
          pageSize={pagination.pageSize}
          currentPage={pagination.current}
          paginationNumber={pagination.pageNumber}
          onPageChanged={pagination.onChange}
          onSizeChange={pagination.onSizeChange}
        />
      );
  };

  useEffect(function getDefaultColumnSorter() {
    const columnSorter = columns.find(
      (column) =>
        !!column.sorter &&
        typeof column.sorter === 'function' &&
        column.sortOrder,
    );
    setDefaultSorter(
      columnSorter?.sortOrder && columnSorter.dataIndex
        ? {
            field: columnSorter.dataIndex,
            order: columnSorter.sortOrder,
          }
        : undefined,
    );
    // eslint-disable-next-line
  }, []);

  useEffect(
    function getPageDataList() {
      if (isServerSide || !pagination) setDataList(data);
      else {
        const start = (pagination?.current - 1) * pagination?.pageSize;
        const end = pagination?.current * pagination?.pageSize;
        let newPageDataList = data;
        if (searchKey)
          newPageDataList = newPageDataList?.filter((data: T) =>
            Object.values(data).some((value) =>
              value?.toString().toLowerCase().includes(searchKey.toLowerCase()),
            ),
          );
        setDataList(newPageDataList.slice(start, end));
      }
    },
    // eslint-disable-next-line
    [data, pagination],
  );

  useEffect(
    () =>
      setCurrentColumnSorter(
        columns.find(
          (column) =>
            !!column.sorter &&
            typeof column.sorter === 'function' &&
            column.sortOrder,
        ) ?? null,
      ),
    // eslint-disable-next-line
    [columns],
  );

  useEffect(
    function sortDataList() {
      if (
        currentColumnSorter?.sorter &&
        typeof currentColumnSorter?.sorter === 'function' &&
        currentColumnSorter?.sortOrder
      ) {
        const { sorter, sortOrder } = currentColumnSorter;
        setDataList((currentDataList) =>
          [...currentDataList].sort((a: T, b: T) => {
            if (sortOrder === OrderDirection.ASC) return sorter(a, b);
            else return sorter(b, a);
          }),
        );
      }
    },
    // eslint-disable-next-line
    [currentColumnSorter],
  );

  return (
    <>
      {renderSearchField()}
      {renderTable()}
      {renderPagination()}
    </>
  );
};

export default Table;
