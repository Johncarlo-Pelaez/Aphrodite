import { ReactElement } from 'react';
import {
  UploadedTable,
  InformationRequestTable,
  QualityCheckTable,
  ApprovalReportTable,
  ImportReportTable,
  RISReportTable,
} from './components';
import { ReportOption } from '../report-status-dropdown';

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
    if (reportType === ReportOption.UPLOADED)
      return <UploadedTable username={username} from={dateFrom} to={dateTo} />;
    if (reportType === ReportOption.INFORMATION_REQUEST)
      return (
        <InformationRequestTable
          username={username}
          from={dateFrom}
          to={dateTo}
        />
      );
    if (reportType === ReportOption.QUALITY_CHECKED)
      return (
        <QualityCheckTable username={username} from={dateFrom} to={dateTo} />
      );
    if (reportType === ReportOption.APPROVAL)
      return (
        <ApprovalReportTable username={username} from={dateFrom} to={dateTo} />
      );
    if (reportType === ReportOption.IMPORT)
      return (
        <ImportReportTable username={username} from={dateFrom} to={dateTo} />
      );
    else
      return <RISReportTable username={username} from={dateFrom} to={dateTo} />;
  };
  return renderTable();
};

export default ReportTable;
