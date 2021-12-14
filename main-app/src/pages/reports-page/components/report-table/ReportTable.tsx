import { ReactElement } from 'react';
import {
  UploadedTable,
  InformationRequestTable,
  QualityCheckTable,
  ApprovalReportTable,
  ImportReportTable,
} from './components';

export interface DocumentsTableProps {
  dateFrom?: Date;
  dateTo?: Date;
  username?: string;
  reportType?: string;
}

export const ReportTable = ({
  dateFrom,
  dateTo,
  username,
  reportType,
}: DocumentsTableProps): ReactElement => {
  const renderTable = (): ReactElement => {
    console.log(reportType);
    if (reportType === 'UPLOADED')
      return <UploadedTable username={username} from={dateFrom} to={dateTo} />;
    if (reportType === 'INFORMATION REQUEST')
      return (
        <InformationRequestTable
          username={username}
          from={dateFrom}
          to={dateTo}
        />
      );
    if (reportType === 'QUALITY CHECKED')
      return (
        <QualityCheckTable username={username} from={dateFrom} to={dateTo} />
      );
    if (reportType === 'APPROVAL')
      return (
        <ApprovalReportTable username={username} from={dateFrom} to={dateTo} />
      );
    else
      return (
        <ImportReportTable username={username} from={dateFrom} to={dateTo} />
      );
  };

  return renderTable();
};

export default ReportTable;
