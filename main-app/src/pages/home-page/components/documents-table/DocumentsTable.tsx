import { ReactElement } from 'react';
import fileSize from 'filesize';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import styles from './DocumentsTable.module.css';
import { Document } from 'models';
import { Pagination, SearchField } from './components';

interface DocumentsTableProps {
  isLoading: boolean;
  hasError: boolean;
  documents: Document[];
  total: number;
  pageSize: number;
  currentPage: number;
  paginationNumber: number;
  searchKey: string;
  selectedDocument?: Document;
  onSelectRow: (document?: Document) => void;
  onPageChanged: (page: number) => void;
  onSizeChange: (pageSize: number) => void;
  onSearchDocument: (seachKey: string) => void;
}

export const DocumentsTable = (props: DocumentsTableProps): ReactElement => {
  const {
    isLoading,
    hasError,
    documents,
    total,
    pageSize,
    currentPage,
    paginationNumber,
    searchKey,
    selectedDocument,
    onSelectRow,
    onPageChanged,
    onSizeChange,
    onSearchDocument,
  } = props;

  const rowCount = documents.length;

  const showRowHighlight = (document: Document): string => {
    return document.id === selectedDocument?.id ? styles.highlightRow : '';
  };

  const renderSearchField = (): ReactElement => {
    return (
      <SearchField searchKey={searchKey} onSearchDocument={onSearchDocument} />
    );
  };

  const setSelectedRow = (document: Document): void => {
    onSelectRow(selectedDocument?.id === document.id ? undefined : document);
  };

  const renderTable = (): ReactElement => {
    if (isLoading) {
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
        <Alert variant="danger" show={hasError}>
          Could not load documents, Please try again.
        </Alert>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                Name <FontAwesomeIcon icon={faSort} />
              </th>
              <th>Size</th>
              <th>User</th>
              <th>
                Date Modified <FontAwesomeIcon icon={faSort} />
              </th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr
                key={document.id}
                className={showRowHighlight(document)}
                onClick={() => setSelectedRow(document)}
              >
                <td>{document.documentName}</td>
                <td>{fileSize(document.documentSize)}</td>
                <td>{`${document.user.firstName} ${document.user.lastName}`}</td>
                <td>
                  {moment(document.modifiedDate).format(DEFAULT_DATE_FORMAT)}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  };

  const renderPagination = (): ReactElement => {
    return (
      <Pagination
        isLoading={isLoading}
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

export default DocumentsTable;
