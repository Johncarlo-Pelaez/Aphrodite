import { ReactElement, useEffect, useState } from 'react';
import {
  UploadedTable,
  InformationRequestTable,
  QualityCheckTable,
  ApprovalReportTable,
  ImportReportTable,
  RISReportTable,
} from './components';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'core/constants';
import { StatusOption } from '../report-status-dropdown';

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
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);

  const renderTable = (): ReactElement => {
    if (reportType === StatusOption.UPLOADED)
      return <UploadedTable username={username} from={start} to={end} />;
    if (reportType === StatusOption.INFORMATION_REQUEST)
      return (
        <InformationRequestTable username={username} from={start} to={end} />
      );
    if (reportType === StatusOption.QUALITY_CHECKED)
      return <QualityCheckTable username={username} from={start} to={end} />;
    if (reportType === StatusOption.APPROVAL)
      return <ApprovalReportTable username={username} from={start} to={end} />;
    if (reportType === StatusOption.IMPORT)
      return <ImportReportTable username={username} from={start} to={end} />;
    else return <RISReportTable username={username} from={start} to={end} />;
  };

  useEffect(() => {
    if (dateFrom && dateTo) {
      setStart(new Date(moment(dateFrom).format(DEFAULT_DATE_FORMAT)));
      setEnd(new Date(moment(dateTo).format(DEFAULT_DATE_FORMAT)));
    }

    return () => {
      setStart(undefined);
      setEnd(undefined);
    };
  }, [dateFrom, dateTo]);

  return renderTable();
};

export default ReportTable;
