import { OrderDirection } from './Table.enum';

export interface TableColumnProps<T> {
  title: string;
  dataIndex: string;
  render?: (obj: T) => any;
  sorter?: (a: T, b: T) => number;
  sortOrder?: OrderDirection;
}

export interface TablePaginationConfig {
  total: number;
  pageNumber: number;
  pageSize: number;
  current: number;
  onChange: (page: number) => void;
  onSizeChange: (pageSize: number) => void;
}

export type SorterResult = {
  field: string;
  order: OrderDirection;
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
  onChange?: (sorter?: SorterResult) => void;
  onSearch?: (seachKey: string) => void;
}
