import { Document } from 'models';

export interface DocumentsTableProps {
  selectedDoc?: Document;
  onSelectDoc: (document?: Document) => void;
}
