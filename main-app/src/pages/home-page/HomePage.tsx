import { useState } from 'react';
import { S3Upload } from './S3Upload';
import { useDocuments } from 'hooks/document';
import { DocumentsTable } from './components';
import { Document } from 'models';

export const HomePage = () => {
  const [selectedDocument, setSelectedDocument] = useState<
    Document | undefined
  >(undefined);
  const [searchKey, setSearchKey] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    isLoading: isDocsLoading,
    isError: hasDocsError,
    data: result,
  } = useDocuments({
    searchKey,
    currentPage,
    pageSize,
  });

  const documents = result?.data || [];
  const count = result?.count || 100;

  return (
    <>
      <S3Upload />
      <DocumentsTable
        isLoading={isDocsLoading}
        hasError={hasDocsError}
        documents={documents}
        total={count}
        pageSize={pageSize}
        currentPage={currentPage}
        paginationNumber={5}
        searchKey={searchKey}
        selectedDocument={selectedDocument}
        onSelectRow={setSelectedDocument}
        onPageChanged={setCurrentPage}
        onSizeChange={setPageSize}
        onSearchDocument={setSearchKey}
      />
    </>
  );
};

export default HomePage;
