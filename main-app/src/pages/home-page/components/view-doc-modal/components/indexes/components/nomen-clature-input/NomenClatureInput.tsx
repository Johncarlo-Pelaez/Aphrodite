import { ReactElement, useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { useNomenClatures } from 'hooks';
import 'react-bootstrap-typeahead/css/Typeahead.css';

export interface NomenClatureInputProps {
  value?: string;
}

export const NomenClatureInput = ({
  value,
}: NomenClatureInputProps): ReactElement => {
  const [options, setOptions] = useState<Option[]>([]);
  const [selectedNomenClature, setSelectedNomenClature] = useState<Option[]>(
    [],
  );

  const { isLoading, data: nomenClatures = [] } = useNomenClatures();

  useEffect(
    function populateNomenClatureOptions() {
      setOptions(
        nomenClatures.map((n) => {
          return {
            id: n.id,
            label: n.description,
          };
        }),
      );
    },
    // eslint-disable-next-line
    [nomenClatures],
  );

  useEffect(
    function setDefaultNomenClature() {
      if (value) setSelectedNomenClature([{ id: Math.random(), label: value }]);
    },
    // eslint-disable-next-line
    [value],
  );

  return (
    <Form.Group>
      <Form.Label>
        <b>Nomenclature</b>
      </Form.Label>
      {/* 
      // @ts-ignore */}
      <Typeahead
        disabled={!!value}
        id="nomen-clature-input"
        isLoading={isLoading}
        onChange={setSelectedNomenClature}
        options={options}
        selected={selectedNomenClature}
      />
    </Form.Group>
  );
};

export default NomenClatureInput;
