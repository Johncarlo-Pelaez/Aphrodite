export interface ExcelCreate {
  columns: ExcelColumn[];
  rows: ExcelRowItem[][];
}

export interface ExcelColumn {
  key: string;
  title: string;
}

export interface ExcelRowItem {
  key: string;
  value: string;
}
