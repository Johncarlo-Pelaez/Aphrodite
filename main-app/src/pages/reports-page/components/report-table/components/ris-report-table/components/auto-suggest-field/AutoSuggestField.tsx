import { ReactElement } from 'react';
import Form from 'react-bootstrap/Form';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import styles from './AutoSuggestField.module.css';

export interface AutoSuggestFieldProps {
  label?: string;
  options: Option[];
  value: Option[];
  isLoading?: boolean;
  isInvalid?: boolean;
  placeholder?: string;
  onChange: (selected: Option[]) => void;
}

export const AutoSuggestField = (
  props: AutoSuggestFieldProps,
): ReactElement => {
  const {
    label,
    options,
    value,
    isLoading = false,
    isInvalid = false,
    placeholder,
    onChange: triggerChange,
  } = props;

  return (
    <Form.Group className={styles.nomenclature}>
      {label && (
        <Form.Label>
          <b>{label}</b>
        </Form.Label>
      )}
      {/*
      // @ts-ignore */}
      <Typeahead
        id="typeahead"
        className={styles.autoSuggestField}
        disabled={isLoading}
        defaultSelected={[]}
        isLoading={isLoading}
        onChange={triggerChange}
        options={options}
        selected={value ?? []}
        isInvalid={isInvalid}
        clearButton
        // @ts-ignore
        placeholder={placeholder}
      />
    </Form.Group>
  );
};

export default AutoSuggestField;
