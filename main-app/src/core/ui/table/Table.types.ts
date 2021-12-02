import { OrderDirection } from './Table.enum';

export interface TableColumnProps<T> {
  title: string;
  dataIndex?: string;
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

export interface SorterResult {
  field: string;
  order: OrderDirection;
}

export declare type RowSelectionType = 'checkbox' | 'radio';
export interface RowSelection<T> {
  type?: RowSelectionType;
  selectedRowKeys: React.Key[];
  onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
}

export interface TableProps<T> {
  isServerSide?: boolean;
  rowKey?: string | ((obj: T) => any);
  loading?: boolean;
  isError?: boolean;
  columns: TableColumnProps<T>[];
  data: T[];
  rowSelection?: RowSelection<T>;
  pagination?: TablePaginationConfig;
  selectedRow?: T;
  onSelectRow?: (selectedRow: T) => void;
  onChange?: (sorter?: SorterResult) => void;
}
