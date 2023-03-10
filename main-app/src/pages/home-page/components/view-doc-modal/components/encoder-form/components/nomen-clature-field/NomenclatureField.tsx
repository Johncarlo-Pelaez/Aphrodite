import { ReactElement, useState, useEffect } from 'react';
import { useController, Control } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { useNomenclatureLookups } from 'hooks';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { IEncoderFormValues } from '../../EncoderForm';

export interface LookupOption extends Record<string, unknown> {
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
  const { isLoading, data: nomenclatureLookups = [] } =
    useNomenclatureLookups();

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
        nomenclatureLookups.map((l) => {
          return {
            id: l.id,
            label: l.nomenclature,
            documentGroup: l.documentGroup,
          };
        }),
      );
    },
    // eslint-disable-next-line
    [nomenclatureLookups],
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
        defaultSelected={[]}
        isLoading={isLoading}
        onChange={onChange}
        options={options}
        selected={value ?? []}
        isInvalid={!!error}
        clearButton
        // @ts-ignore
        placeholder="Enter Nomenclature"
      />
      <Form.Control.Feedback type="invalid">
        {error?.message}
      </Form.Control.Feedback>
    </Form.Group>
  );
};

export default NomenclatureField;
