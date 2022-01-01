import { ReactElement, useEffect, useState } from 'react';
import { AutoSuggestField } from 'core/ui';

export interface DocTypeRIS {
  CompanyCode: string;
  ContractNumber: string;
  Brand: string;
  DocumentGroup: string;
  Nomenclature: string;
  AccountName: string;
  ProjectName: string;
  UnitDetails: string;
  Transmittal: string;
  CopyType: string;
  ProjectCode: string;
  TowerPhase: string;
}

export interface NomenclatureDropdownProps {
  onChange: (nomenclature?: string) => void;
  indexes?: DocTypeRIS[];
  value?: string;
  isLoading: boolean;
  isError: boolean;
}

export const NomenclatureDropdown = ({
  onChange,
  indexes,
  value,
  isLoading,
  isError,
}: NomenclatureDropdownProps): ReactElement => {
  const [nomenclature, setNomenclature] = useState<string[]>([]);

  useEffect(() => {
    if (indexes) {
      let nomenclatures = indexes.map((prop) => {
        return prop?.Nomenclature ? prop?.Nomenclature : '';
      });
      nomenclatures = Array.from(
        new Set(nomenclatures.filter((i) => i !== '')),
      );
      setNomenclature(nomenclatures);
    }
    return () => {
      setNomenclature([]);
    };
  }, [indexes]);

  return (
    <div>
      <AutoSuggestField
        isLoading={isLoading}
        isInvalid={isError}
        placeholder="Filter by Nomenclature"
        options={nomenclature}
        value={value ? [value] : []}
        onChange={(nomenclature) => {
          onChange(
            !!nomenclature.length && typeof nomenclature[0] === 'string'
              ? nomenclature[0]
              : undefined,
          );
        }}
      />
    </div>
  );
};

export default NomenclatureDropdown;
