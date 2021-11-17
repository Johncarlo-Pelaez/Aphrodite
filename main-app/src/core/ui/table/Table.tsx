import { ReactElement, useState, useEffect } from 'react';
import BTable from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
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
    rowSelection,
    pagination,
    searchKey,
    selectedRow,
    onSelectRow,
    onChange,
    onSearch,
  } = props;
  const rowCount = dataList.length;
  const sortOrderSequence = [
    OrderDirection.ASC,
    OrderDirection.DESC,
    undefined,
  ];

  const getRowKey = (rowData: T): React.Key | undefined => {
    if (typeof rowKey === 'function') return rowKey(rowData);
    else if (typeof rowKey === 'string') return rowData[rowKey];
    else return undefined;
  };

  const showRowHighlight = (rowData: T): string => {
    return getRowKey(rowData) === (selectedRow && getRowKey(selectedRow))
      ? 'highlight-row'
      : '';
  };

  const setSelectedRow = (rowData: T): void => {
    if (onSelectRow && typeof onSelectRow === 'function') onSelectRow(rowData);
  };

  const handleRowSelectionChange = (checked: boolean, rowData: T): void => {
    if (rowSelection) {
      const { onChange: onRowsChange, selectedRowKeys } = rowSelection;
      let newSelectedRowKey: React.Key | undefined = getRowKey(rowData),
        newSelectedRows: T[],
        newSelectedRowKeys: React.Key[];

      if (!newSelectedRowKey) return;

      const currentSelectedRows = dataList.filter((row) =>
        selectedRowKeys.some((key) => key === getRowKey(row)),
      );

      if (checked) {
        newSelectedRowKeys = [...selectedRowKeys, newSelectedRowKey];
        newSelectedRows = [...currentSelectedRows, rowData];
      } else {
        newSelectedRowKeys = selectedRowKeys.filter(
          (key) => key !== newSelectedRowKey,
        );
        newSelectedRows = currentSelectedRows.filter(
          (row) => getRowKey(row) !== newSelectedRowKey,
        );
      }

      if (onRowsChange && typeof onRowsChange === 'function')
        onRowsChange(newSelectedRowKeys, newSelectedRows);
    }
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

  const isRowSelected = (rowData: T): boolean => {
    return (
      rowSelection?.selectedRowKeys.some((key) => key === getRowKey(rowData)) ??
      false
    );
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
            <tr>
              {rowSelection && <th>{''}</th>}
              {renderTableColumns()}
            </tr>
          </thead>
          <tbody>
            {dataList.map((data, index) => (
              <tr
                key={`row-${index}`}
                className={showRowHighlight(data)}
                onClick={() => setSelectedRow(data)}
              >
                {rowSelection && (
                  <td key={`selection-column-${index}`}>
                    <Form.Check
                      onChange={(event) =>
                        handleRowSelectionChange(event.target.checked, data)
                      }
                      key={`selection-${index}`}
                      type={rowSelection?.type ?? 'checkbox'}
                      checked={isRowSelected(data)}
                    />
                  </td>
                )}
                {columns.map(({ dataIndex, render }, index) => (
                  <td key={`column-${index}`}>
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
