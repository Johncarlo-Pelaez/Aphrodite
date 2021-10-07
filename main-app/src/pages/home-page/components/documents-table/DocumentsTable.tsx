import { ReactElement } from 'react';
import fileSize from 'filesize';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
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
  onSelectRow: (document: Document) => void;
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

  const showRowHighlight = (document: Document): string => {
    return document.id === selectedDocument?.id ? styles.highlightRow : '';
  };

  const renderSearchField = (): ReactElement => {
    return (
      <SearchField searchKey={searchKey} onSearchDocument={onSearchDocument} />
    );
  };

  const renderTable = (): ReactElement => {
    if (isLoading) {
      return (
        <div className="w-100 p-4 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
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
              <th>Name</th>
              <th>Size</th>
              <th>User</th>
              <th>Date Modified</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr
                key={document.id}
                className={showRowHighlight(document)}
                onClick={() => onSelectRow(document)}
              >
                <td>{document.documentName}</td>
                <td>{fileSize(document.documentSize)}</td>
                <td>{`${document.user.firstName} ${document.user.lastName}`}</td>
                <td>{document.modifiedDate}</td>
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
        rowCount={documents.length}
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
