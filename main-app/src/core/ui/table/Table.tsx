import { ReactElement, Fragment, useState, useEffect, useMemo } from 'react';
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
import { TableProps, SorterResult } from './Table.types';
import { SortOrder } from './Table.enum';
import { Pagination } from './components';

export const Table = <T extends Record<string, any> = {}>(
  props: TableProps<T>,
): ReactElement => {
  const {
    isServerSide,
    rowKey,
    loading,
    isError,
    columns,
    data,
    rowSelection,
    pagination,
    selectedRow,
    onSelectRow,
    onDoubleClickRow,
    onChange,
  } = props;

  const [defaultSorter, setDefaultSorter] = useState<SorterResult | undefined>(
    undefined,
  );
  const [rowSelectionCheck, setRowSelectionCheck] = useState<boolean>(false);
  const currentColumnSorter = useMemo(
    function getCurrentColumnSorter() {
      return (
        columns.find(
          (column) =>
            !!column.sorter &&
            typeof column.sorter === 'function' &&
            column.sortOrder,
        ) ?? null
      );
    },
    [columns],
  );
  const { dataList, total: rowCount } = useMemo(
    function getPageItemsList() {
      let dataList: T[];
      if (isServerSide || !pagination) {
        dataList = data;
      } else {
        const start = (pagination?.current - 1) * pagination?.pageSize;
        const end = pagination?.current * pagination?.pageSize;
        dataList = data.slice(start, end);
      }
      if (
        currentColumnSorter?.sorter &&
        typeof currentColumnSorter?.sorter === 'function' &&
        currentColumnSorter?.sortOrder
      ) {
        const { sorter, sortOrder } = currentColumnSorter;
        dataList = dataList.sort((a: T, b: T) => {
          if (sortOrder === SortOrder.ASC) return sorter(a, b);
          else return sorter(b, a);
        });
      }
      return { dataList, total: dataList.length };
    },
    [isServerSide, data, pagination, currentColumnSorter],
  );
  const hasData = rowCount > 0;
  const sortOrderSequence = [SortOrder.ASC, SortOrder.DESC, undefined];

  const getItemKey = (rowData: T): React.Key | undefined => {
    if (typeof rowKey === 'function') return rowKey(rowData);
    else if (typeof rowKey === 'string') return rowData[rowKey];
    else return undefined;
  };

  const showRowHighlight = (rowData: T): string => {
    return getItemKey(rowData) === (selectedRow && getItemKey(selectedRow)) ||
      isRowSelected(rowData)
      ? 'highlight-row'
      : '';
  };

  const triggerSelectRow = (rowData: T): void => {
    if (onSelectRow && typeof onSelectRow === 'function') onSelectRow(rowData);
  };

  const triggerDoubleClickRow = (rowData: T): void => {
    if (onDoubleClickRow && typeof onDoubleClickRow === 'function')
      onDoubleClickRow(rowData);
  };

  const triggerSelectionOnChange = (
    newSelectedRowKeys: React.Key[],
    newSelectedRows: T[],
  ): void => {
    if (rowSelection && typeof rowSelection.onChange === 'function')
      rowSelection.onChange(newSelectedRowKeys, newSelectedRows);
  };

  const handleRowSelectionChange = (checked: boolean, rowData: T): void => {
    if (rowSelection) {
      const { selectedRowKeys } = rowSelection;
      let newSelectedRowKey: React.Key | undefined = getItemKey(rowData),
        newSelectedRows: T[],
        newSelectedRowKeys: React.Key[];

      if (!newSelectedRowKey) return;

      const currentSelectedRows = dataList.filter((row) =>
        selectedRowKeys.some((key) => key === getItemKey(row)),
      );

      if (checked) {
        newSelectedRowKeys = [...selectedRowKeys, newSelectedRowKey];
        newSelectedRows = [...currentSelectedRows, rowData];
      } else {
        newSelectedRowKeys = selectedRowKeys.filter(
          (key) => key !== newSelectedRowKey,
        );
        newSelectedRows = currentSelectedRows.filter(
          (row) => getItemKey(row) !== newSelectedRowKey,
        );
      }

      triggerSelectionOnChange(newSelectedRowKeys, newSelectedRows);
    }
  };

  const triggerOnChange = (sorter?: SorterResult): void => {
    if (onChange && typeof onChange === 'function') onChange(sorter);
  };

  const renderTableColumns = (): ReactElement[] => {
    return columns.map(({ title, dataIndex, sortOrder, sorter }, index) => {
      const sorterConfig =
        dataIndex && typeof sorter === 'function' && sortOrder;
      const isDefaultSorter = dataIndex === defaultSorter?.field;
      const isSelfCurrentSorter = currentColumnSorter?.dataIndex === dataIndex;
      const isAsc = sortOrder === SortOrder.ASC;
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
                newSortOrder = isAsc ? SortOrder.DESC : SortOrder.ASC;
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
      rowSelection?.selectedRowKeys.some(
        (key) => key === getItemKey(rowData),
      ) ?? false
    );
  };

  const renderTable = (): ReactElement => (
    <div className="table-container">
      {loading && (
        <div className="b-table__spinner">
          <Spinner animation="border" />
        </div>
      )}
      <Alert className="text-center" variant="danger" show={isError}>
        Could not load data, Please try again.
      </Alert>
      <Alert
        className="text-center"
        variant="light"
        show={!hasData && !isError}
      >
        No Data.
      </Alert>
      {hasData && !isError && (
        <BTable className="b-table" borderless hover>
          <thead>
            <tr>
              {rowSelection && (
                <th className="selection-column">
                  <Form.Check
                    onChange={(event) =>
                      setRowSelectionCheck(event.target.checked)
                    }
                    type={rowSelection?.type ?? 'checkbox'}
                    checked={rowSelectionCheck}
                  />
                </th>
              )}
              {renderTableColumns()}
            </tr>
          </thead>
          <tbody>
            {dataList.map((data, index) => (
              <tr
                key={`row-${index}`}
                className={showRowHighlight(data)}
                onClick={() => triggerSelectRow(data)}
                onDoubleClick={() => triggerDoubleClickRow(data)}
              >
                {rowSelection && (
                  <td key={`selection-row-${index}`}>
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
      )}
    </div>
  );

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
    function onSelectAllRow() {
      let newSelectedRows: T[], newSelectedRowKeys: React.Key[];
      if (rowSelectionCheck) {
        newSelectedRows = dataList;
        newSelectedRowKeys = dataList.reduce(
          (itemsKey: React.Key[], currentItem: T) => {
            const itemKey = getItemKey(currentItem);
            if (itemKey) itemsKey.push(itemKey);
            return itemsKey;
          },
          [],
        );
      } else {
        newSelectedRows = [];
        newSelectedRowKeys = [];
      }
      triggerSelectionOnChange(newSelectedRowKeys, newSelectedRows);
    },
    // eslint-disable-next-line
    [rowSelectionCheck],
  );

  useEffect(
    function onSelectAllItems() {
      const allPageItemsKey = dataList.map((item) => getItemKey(item));
      const selectedRowKey = selectedRow ? getItemKey(selectedRow) : undefined;
      const rowSelectionKeys = rowSelection?.selectedRowKeys ?? [];
      const allSelectedItemsKey = selectedRowKey
        ? [...rowSelectionKeys, selectedRowKey]
        : rowSelectionKeys;

      if (
        !!allSelectedItemsKey.length &&
        allPageItemsKey.every((pik) =>
          allSelectedItemsKey.some((ask) => ask === pik),
        )
      )
        setRowSelectionCheck(true);

      if (!allSelectedItemsKey.length) setRowSelectionCheck(false);
    },
    // eslint-disable-next-line
    [rowSelection, selectedRow],
  );

  return (
    <Fragment>
      {renderTable()}
      {renderPagination()}
    </Fragment>
  );
};

export default Table;
