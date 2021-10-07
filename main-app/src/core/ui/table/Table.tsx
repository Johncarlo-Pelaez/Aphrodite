import { ReactElement } from 'react';
import BTable from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import styles from './Table.module.css';
import { TableProps } from './Table.types';
import { Pagination, SearchField } from './components';

export const Table = <T extends Record<string, any> = {}>(
  props: TableProps<T>,
): ReactElement => {
  const {
    rowKey,
    loading,
    isError,
    columns,
    data,
    total,
    pageSize,
    currentPage,
    paginationNumber,
    searchKey,
    selectedRow,
    onSelectRow,
    onPageChanged,
    onSizeChange,
    onSearchDocument,
  } = props;

  const rowCount = data.length;

  const showRowHighlight = (rowData: T): string => {
    if (!selectedRow) return '';
    if (typeof rowKey === 'function') {
      return rowKey(rowData) === rowKey(selectedRow) ? styles.highlightRow : '';
    } else if (typeof rowKey === 'string') {
      return rowData[rowKey] === selectedRow[rowKey] ? styles.highlightRow : '';
    }
    return '';
  };

  const renderSearchField = (): ReactElement => {
    return (
      <SearchField searchKey={searchKey} onSearchDocument={onSearchDocument} />
    );
  };

  const setSelectedRow = (rowData: T): void => {
    onSelectRow(selectedRow?.id === rowData.id ? undefined : rowData);
  };

  const renderTable = (): ReactElement => {
    if (loading) {
      return (
        <div className="w-100 p-4 d-flex justify-content-center align-items-center">
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

    return (
      <>
        <Alert variant="danger" show={isError}>
          Could not load documents, Please try again.
        </Alert>
        <BTable striped bordered hover>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>
                  {col.title} <FontAwesomeIcon icon={faSort} />
                </th>
              ))}
            </tr>
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
      </>
    );
  };

  const renderPagination = (): ReactElement => {
    return (
      <Pagination
        isLoading={loading}
        total={total}
        rowCount={rowCount}
        pageSize={pageSize}
        currentPage={currentPage}
        paginationNumber={paginationNumber}
        onPageChanged={onPageChanged}
        onSizeChange={onSizeChange}
      />
    );
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
