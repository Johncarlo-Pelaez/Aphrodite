import { ReactElement, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useLookups } from 'hooks';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export interface LookupOption extends Record<string, unknown> {
  id: number;
  label: string;
  documentGroup?: string;
}

export interface NomenClatureInputProps {
  value: LookupOption[];
  onChange: (selected: LookupOption[]) => void;
}

export const NomenClatureInput = ({
  value,
  onChange,
}: NomenClatureInputProps): ReactElement => {
  const [options, setOptions] = useState<LookupOption[]>([]);

  const { isLoading, data: lookups = [] } = useLookups();

  useEffect(
    function populateNomenClatureOptions() {
      setOptions(
        lookups.map((l) => {
          return {
            id: l.id,
            label: l.nomenClature,
            documentGroup: l.documentGroup,
          };
        }),
      );
    },
    // eslint-disable-next-line
    [lookups],
  );

  return (
    <Form.Group>
      <Form.Label>
        <b>Nomenclature</b>
      </Form.Label>
      {/* 
      // @ts-ignore */}
      <Typeahead
        disabled={isLoading}
        name="nomenclature"
        // @ts-ignore
        defaultSelected={[]}
        id="nomen-clature-input"
        isLoading={isLoading}
        // @ts-ignore
        onChange={onChange}
        options={options}
        // @ts-ignore
        selected={value}
      />
    </Form.Group>
  );
};

export default NomenClatureInput;
