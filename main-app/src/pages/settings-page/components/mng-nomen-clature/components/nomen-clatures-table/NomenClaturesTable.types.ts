import { NomenClature } from 'models';

export interface NomenClaturesTableProps {
  selectedNomenClature?: NomenClature;
  onSelectNomenClature: (nomenClature?: NomenClature) => void;
}
