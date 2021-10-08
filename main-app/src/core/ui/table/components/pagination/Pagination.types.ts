export interface PaginationProps {
  isLoading?: boolean;
  total: number;
  rowCount: number;
  pageSize: number;
  currentPage: number;
  paginationNumber: number;
  onPageChanged: (page: number) => void;
  onSizeChange: (pageSize: number) => void;
}