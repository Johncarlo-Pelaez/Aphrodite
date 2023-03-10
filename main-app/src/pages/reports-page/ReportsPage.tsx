import { ReactElement, useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'react-bootstrap';
import {
  ReportStatusDropdown,
  UserDropdown,
  ReportOption,
  ReportTable,
} from './components';
import { DateSelect } from './components';

export const ReportsPage = (): ReactElement => {
  const [reportType, setReportType] = useState<ReportOption>(
    ReportOption.UPLOADED,
  );
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);
  const [user, setUser] = useState<string | undefined>(undefined);
  const [isTriggered, setIsTriggered] = useState<boolean>(false);

  const collectFilter = () => {
    setStart(dateFrom);
    setEnd(dateTo);
    setUser(username);
    setIsTriggered(true);
  };

  useEffect(() => {
    if (reportType) {
      setStart(undefined);
      setEnd(undefined);
      setUser(undefined);
      setUsername(undefined);
      setDateFrom(undefined);
      setDateTo(undefined);
      setIsTriggered(false);
    }
  }, [reportType]);


  useEffect(() => {
    return function componentCleanUp () {
      setIsTriggered(false);
      setStart(undefined);
      setEnd(undefined);
      setUser(undefined);
      setUsername(undefined);
      setDateFrom(undefined);
      setDateTo(undefined);
    };
  }, []);

  return (
    <Container className="my-4" fluid>
      <h4 className="fw-normal py-3">Reports</h4>
      <Row>
        <Col className="mb-0" xs={12} lg={2}>
          <ReportStatusDropdown
            selected={reportType}
            onChange={setReportType}
          />
        </Col>
        <Col className="mb-0" xs={12} lg={2}>
          <UserDropdown value={username} onChange={setUsername} />
        </Col>
        <Col className="mb-0" xs={12} lg={2}>
          <DateSelect
            value={dateFrom}
            onChange={setDateFrom}
            label="From:"
            horizontal
          />
        </Col>
        <Col className="mb-0" xs={12} lg={2}>
          <DateSelect
            value={dateTo}
            onChange={setDateTo}
            label="To:"
            horizontal
          />
        </Col>
        <Col>
          <Button variant="outline-secondary" onClick={collectFilter}>
            Filter
          </Button>
        </Col>
      </Row>
      <ReportTable
        username={user}
        dateFrom={start}
        dateTo={end}
        reportType={reportType}
        isTriggered={isTriggered}
      />
    </Container>
  );
};

export default ReportsPage;
