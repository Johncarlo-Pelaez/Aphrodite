import { ReactElement, useState, useEffect } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useLookups } from 'hooks';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { IEncoderFormValues } from '../../EncoderForm';

export interface LookupOption extends Record<string, unknown> {
  id: number;
  label: string;
  documentGroup: string;
}

export interface NomenclatureFieldProps {
  control: Control<IEncoderFormValues>;
}

export const NomenclatureField = ({
  control,
}: NomenclatureFieldProps): ReactElement => {
  const [options, setOptions] = useState<LookupOption[]>([]);
  const { isLoading, data: lookups = [] } = useLookups();

  const {
    field: { onChange, value, ref },
    fieldState: { error },
  } = useController({
    control,
    name: 'nomenclature',
  });

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
        ref={ref}
        id="nomen-clature-field"
        disabled={isLoading}
        // @ts-ignore
        defaultSelected={[]}
        isLoading={isLoading}
        // @ts-ignore
        onChange={onChange}
        options={options}
        // @ts-ignore
        selected={value ?? []}
        isInvalid={!!error}
        clearButton
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default NomenclatureField;
