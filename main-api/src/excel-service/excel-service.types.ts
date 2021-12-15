export interface ExcelCreate<T> {
  columns: ExcelColumn<T>[];
  rows: T[];
}

export interface ExcelColumn<T> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (rowData: T) => string;
}
