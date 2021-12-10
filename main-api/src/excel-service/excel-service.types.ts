export interface ExcelCreate {
  columns: ExcelColumn[];
  rows: ExcelRowItem[][];
}

export interface ExcelColumn {
  key: string;
  title: string;
  render?: (value: any) => string;
}

export interface ExcelRowItem {
  key: string;
  value: any;
}
