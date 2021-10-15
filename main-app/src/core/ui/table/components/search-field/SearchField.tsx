import { ReactElement, useRef } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import styles from './SearchField.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchFieldProps {
  searchKey: string;
  onSearchDocument: (seachKey: string) => void;
}

export const SearchField = (props: SearchFieldProps): ReactElement => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { searchKey, onSearchDocument } = props;

  const searchDocs = (): void => {
    onSearchDocument(searchInputRef?.current?.value ?? '');
  };

  return (
    <div className="d-flex justify-content-end">
      <div className={styles.searchField}>
        <FontAwesomeIcon className={styles.searchIcon} icon={faSearch} />
        <FormControl
          className={styles.searchInput}
          ref={searchInputRef}
          placeholder="Search"
          aria-label="Search"
          aria-describedby="Search documents"
          type="text"
          value={searchKey}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
              searchDocs();
            }
          }}
          onChange={(e) => onSearchDocument(e.target.value ?? '')}
        />
      </div>
    </div>
  );
};

export default SearchField;
