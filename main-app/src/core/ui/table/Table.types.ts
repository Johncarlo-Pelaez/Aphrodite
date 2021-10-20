export interface TableColumnProps<T> {
  title: string;
  dataIndex: string;
  render?: (obj: T) => any;
  sorter?: boolean;
}

export interface TablePaginationConfig {
  total: number;
  pageNumber: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
  onSizeChange: (pageSize: number) => void;
}

export declare type SortOrder = 'ASC' | 'DESC' | null;

export type Sorter = {
  field: string;
  order: SortOrder;
  orderIndex: number;
};

export interface TableProps<T> {
  isServerSide?: boolean;
  rowKey?: string | ((obj: T) => any);
  loading?: boolean;
  isError?: boolean;
  columns: TableColumnProps<T>[];
  data: T[];
  pagination?: TablePaginationConfig;
  searchKey?: string;
  selectedRow?: T;
  onSelectRow?: (row?: T) => void;
  onChange?: (sorter: Sorter | undefined) => void;
  onSearch?: (seachKey: string) => void;
}
