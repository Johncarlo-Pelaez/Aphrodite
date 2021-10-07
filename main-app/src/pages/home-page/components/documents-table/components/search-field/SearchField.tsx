import { ReactElement } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import styles from './SearchField.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchFieldProps {
  searchKey: string;
  onSearchDocument: (seachKey: string) => void;
}

export const SearchField = (props: SearchFieldProps): ReactElement => {
  const { searchKey, onSearchDocument } = props;

  return (
    <InputGroup className={styles.searchField}>
      <FormControl
        placeholder="Search"
        aria-label="Search"
        aria-describedby="Search documents"
        type="text"
        value={searchKey}
        onChange={(e) => onSearchDocument(e.target.value ?? '')}
      />
      <Button variant="outline-secondary" id="button-addon2">
        <FontAwesomeIcon icon={faSearch} />
      </Button>
    </InputGroup>
  );
};

export default SearchField;
