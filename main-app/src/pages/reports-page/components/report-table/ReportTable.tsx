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
  isTriggered?: boolean;
}

export const ReportTable = ({
  dateFrom,
  dateTo,
  username,
  reportType,
  isTriggered,
}: DocumentsTableProps): ReactElement => {
  const renderTable = (): ReactElement => {
    switch (reportType) {
      case ReportOption.UPLOADED:
        return (
          <UploadedTable username={username} from={dateFrom} to={dateTo} isTriggered={isTriggered} />
        );
      case ReportOption.INFORMATION_REQUEST:
        return (
          <InformationRequestTable
            username={username}
            from={dateFrom}
            to={dateTo}
            isTriggered={isTriggered}
          />
        );
      case ReportOption.QUALITY_CHECKED:
        return (
          <QualityCheckTable username={username} from={dateFrom} to={dateTo} isTriggered={isTriggered} />
        );
      case ReportOption.APPROVAL:
        return (
          <ApprovalReportTable
            username={username}
            from={dateFrom}
            to={dateTo}
            isTriggered={isTriggered}
          />
        );
      case ReportOption.IMPORT:
        return (
          <ImportReportTable username={username} from={dateFrom} to={dateTo} isTriggered={isTriggered} />
        );
      case ReportOption.RIS:
        return (
          <RISReportTable username={username} from={dateFrom} to={dateTo} isTriggered={isTriggered} />
        );
      default:
        return <></>;
    }
  };
  return renderTable();
};

export default ReportTable;
