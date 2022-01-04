import { ReactElement, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  ReportStatusDropdown,
  UserDropdown,
  StatusOption,
  ReportTable,
} from './components';
import { DateSelect } from 'core/ui';

export const ReportsPage = (): ReactElement => {
  const [reportType, setReportType] = useState<StatusOption>(
    StatusOption.UPLOADED,
  );
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

  return (
    <Container className="my-4" fluid>
      <h4 className="fw-normal py-3">Reports</h4>
      <Row className="my-2">
        <Col className="mb-2" xs={12} lg={2}>
          <ReportStatusDropdown
            selected={reportType}
            onChange={setReportType}
          />
        </Col>
        <Col className="mb-2" xs={12} lg={2}>
          <UserDropdown value={username} onChange={setUsername} />
        </Col>
        <Col className="mb-2" xs={12} lg={2}>
          <DateSelect
            value={dateFrom}
            onChange={setDateFrom}
            label="From:"
            horizontal
          />
        </Col>
        <Col className="mb-2" xs={12} lg={2}>
          <DateSelect
            value={dateTo}
            onChange={setDateTo}
            label="To:"
            horizontal
          />
        </Col>
      </Row>
      <ReportTable
        username={username}
        dateFrom={dateFrom}
        dateTo={dateTo}
        reportType={reportType}
      />
    </Container>
  );
};

export default ReportsPage;
