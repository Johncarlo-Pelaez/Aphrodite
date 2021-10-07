import { ReactElement, useRef } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import styles from './SearchField.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchFieldProps {
  searchKey?: string;
  onSearchDocument: (seachKey: string) => void;
}

export const SearchField = (props: SearchFieldProps): ReactElement => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { onSearchDocument } = props;

  const searchDocs = (): void => {
    onSearchDocument(searchInputRef?.current?.value ?? '');
  };

  return (
    <div className="d-flex justify-content-end">
      <InputGroup className={styles.searchField}>
        <FormControl
          ref={searchInputRef}
          placeholder="Search"
          aria-label="Search"
          aria-describedby="Search documents"
          type="text"
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
              searchDocs();
            }
          }}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={() => searchDocs()}
        >
          <FontAwesomeIcon icon={faSearch} />
        </Button>
      </InputGroup>
    </div>
  );
};

export default SearchField;
