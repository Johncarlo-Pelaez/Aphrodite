import { S3Upload } from './S3Upload';
import { DocumentsTable } from './components';

export const HomePage = () => {
  return (
    <>
      <S3Upload />
      <DocumentsTable />
    </>
  );
};

export default HomePage;
