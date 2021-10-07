export interface TableColumnProps<T> {
  title: string;
  dataIndex: string;
  render?: (obj: T) => any
}

export interface TableProps<T> {
  rowKey?: string | ((obj: T) => any);
  loading: boolean;
  isError: boolean;
  columns: TableColumnProps<T>[];
  data: T[];
  total: number;
  pageSize: number;
  currentPage: number;
  paginationNumber: number;
  searchKey: string;
  selectedRow?: T;
  onSelectRow: (document?: T) => void;
  onPageChanged: (page: number) => void;
  onSizeChange: (pageSize: number) => void;
  onSearchDocument: (seachKey: string) => void;
}
  