import { ChangeEvent, ReactElement, useState, useEffect } from 'react';
import BPagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { PaginationProps } from './Pagination.types';

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
  const showingFrom = currentPage * pageSize + 1 - pageSize;
  const showingTo = showingFrom + rowCount - 1;
  const disabled = isLoading || totalPage <= 0;
  const isGotoFirstPageHidden = !!paginations.find((p) => p === 1);
  const isPrevPageHidden = currentPage === 1;
  const isNextPageHidden = currentPage === totalPage;
  const isGotoLastPageHidden = !!paginations.find((p) => p === totalPage);

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
    if (currentPage > totalPage && totalPage > 0) onPageChanged(totalPage);
    if (currentPage === 0 && totalPage > 0) onPageChanged(1);
    // eslint-disable-next-line
  }, [currentPage, paginationNumber, totalPage]);

  return (
    <div className="b-table__pagination">
      <p>
        {`Showing ${totalPage > 0 ? showingFrom : 0} to ${
          totalPage > 0 ? showingTo : 0
        } of ${total} entries `}
      </p>
      <Row className="d-flex justify-content-end">
        <Col xs="auto">
          <BPagination>
            <BPagination.First
              onClick={() => onPageChanged(1)}
              hidden={isGotoFirstPageHidden}
              disabled={isGotoFirstPageHidden || disabled}
            />
            <BPagination.Prev
              onClick={() => onPageChanged(currentPage - 1)}
              hidden={isPrevPageHidden}
              disabled={isPrevPageHidden || disabled}
            />
            {paginations.map((pageNumber: number, index: number) => (
              <BPagination.Item
                key={index}
                active={pageNumber === currentPage}
                onClick={() => onPageChanged(pageNumber)}
                disabled={disabled}
              >
                {pageNumber}
              </BPagination.Item>
            ))}
            <BPagination.Next
              onClick={() => onPageChanged(currentPage + 1)}
              hidden={isNextPageHidden}
              disabled={isNextPageHidden || disabled}
            />
            <BPagination.Last
              onClick={() => onPageChanged(totalPage)}
              hidden={isGotoLastPageHidden}
              disabled={isGotoLastPageHidden || disabled}
            />
          </BPagination>
        </Col>
        <Col xs="auto">
          <Form>
            <Form.Group as={Row} className="align-items-center">
              <Col xs="auto">
                <Form.Label>Go to page:</Form.Label>
              </Col>
              <Col xs="auto">
                <Form.Control
                  disabled={disabled}
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
                  disabled={disabled}
                  value={pageSize}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    onSizeChange(Number(event.target.value));
                  }}
                >
                  {[5, 10, 15, 20, 30].map((pageSize) => (
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
    </div>
  );
};

export default Pagination;
