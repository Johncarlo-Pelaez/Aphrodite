import {
  ChangeEvent,
  ReactElement,
  useState,
  useEffect,
  CSSProperties,
} from 'react';
import BPagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface PaginationProps {
  isLoading: boolean;
  total: number;
  rowCount: number;
  pageSize: number;
  currentPage: number;
  paginationNumber: number;
  onPageChanged: (page: number) => void;
  onSizeChange: (pageSize: number) => void;
}

export const Pagination = (props: PaginationProps): ReactElement => {
  const [paginations, setPaginations] = useState<number[]>([]);
  const {
    isLoading,
    total,
    rowCount,
    pageSize,
    currentPage,
    paginationNumber,
    onPageChanged,
    onSizeChange,
  } = props;
  const pageRemain = total % pageSize > 0 ? 1 : 0;
  const totalPage = Math.trunc(total / pageSize) + pageRemain;
  const showingFrom =
    currentPage > 0 ? currentPage * pageSize + 1 - pageSize : 0;
  const showingTo = currentPage > 0 ? showingFrom + rowCount - 1 : 0;

  const controlsEnabilityStyle = (): CSSProperties => {
    return {
      pointerEvents: isLoading || currentPage === 0 ? 'none' : 'auto',
      opacity: isLoading || currentPage === 0 ? '0.5' : 1,
    };
  };

  const getPaginationNumbers = (): number[] => {
    let pageNumbers: number[] = [currentPage];
    let paginationRadius = Math.trunc(paginationNumber / 2);
    let addPrevPage = 0;
    let prevPageNumber = currentPage;
    for (let i = 0; i < paginationRadius; i++) {
      prevPageNumber--;
      if (prevPageNumber <= 0) addPrevPage++;
      else pageNumbers.push(prevPageNumber);
    }
    let nextPageNumber = currentPage;
    for (let i = 0; i < paginationRadius + addPrevPage; i++) {
      nextPageNumber++;
      if (nextPageNumber > totalPage)
        pageNumbers.push(Math.min(...pageNumbers) - 1);
      else pageNumbers.push(nextPageNumber);
    }
    return pageNumbers.filter((pn) => pn >= 1).sort((a, b) => a - b);
  };

  useEffect(() => {
    setPaginations(getPaginationNumbers());
    if (totalPage > 0 && currentPage === 0) onPageChanged(1);
    if (currentPage > totalPage) onPageChanged(totalPage);
    // eslint-disable-next-line
  }, [currentPage, paginationNumber, totalPage]);

  return (
    <Row
      className="d-flex justify-content-end"
      style={controlsEnabilityStyle()}
    >
      <Col xs="auto">
        <BPagination>
          <BPagination.First
            onClick={() => onPageChanged(1)}
            disabled={!!paginations.find((p) => p === 1)}
          />
          <BPagination.Prev
            onClick={() => onPageChanged(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {paginations.map((pageNumber: number, index: number) => (
            <BPagination.Item
              key={index}
              active={pageNumber === currentPage}
              onClick={() => onPageChanged(pageNumber)}
            >
              {pageNumber}
            </BPagination.Item>
          ))}
          <BPagination.Next
            onClick={() => onPageChanged(currentPage + 1)}
            disabled={currentPage === totalPage}
          />
          <BPagination.Last
            onClick={() => onPageChanged(totalPage)}
            disabled={!!paginations.find((p) => p === totalPage)}
          />
        </BPagination>
      </Col>
      <Col xs="auto">
        <Form>
          <Form.Group as={Row} className="align-items-center">
            <Col xs="auto">
              <Form.Label>
                {`Showing ${showingFrom} to ${showingTo} of ${total} entries `}|
                Go to page:{' '}
              </Form.Label>
            </Col>
            <Col xs="auto">
              <Form.Control
                placeholder="page"
                type="number"
                min={1}
                max={totalPage}
                value={currentPage}
                onChange={(e) => {
                  let page = e.target.value ? Number(e.target.value) : 0;
                  if (page > totalPage) page = totalPage;
                  if (page <= 0) page = 1;
                  onPageChanged(page);
                }}
              />
            </Col>
            <Col xs="auto">
              <Form.Select
                value={pageSize}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  onSizeChange(Number(event.target.value));
                }}
              >
                {[10, 15, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Form.Group>
        </Form>
      </Col>
    </Row>
  );
};

export default Pagination;
