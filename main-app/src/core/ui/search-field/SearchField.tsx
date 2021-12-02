import { ReactElement } from 'react';
import FormControl from 'react-bootstrap/FormControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchFieldProps {
  searchKey: string;
  onSearchDocument: (seachKey: string) => void;
}

export const SearchField = (props: SearchFieldProps): ReactElement => {
  const { searchKey, onSearchDocument } = props;

  const searchDocs = (event: React.ChangeEvent<any>): void => {
    onSearchDocument(event.target.value);
  };

  return (
    <div className="search-field__container">
      <div className="search-field__wrapper">
        <FontAwesomeIcon icon={faSearch} />
        <FormControl
          placeholder="Search"
          aria-label="Search"
          aria-describedby="Search documents"
          type="text"
          value={searchKey}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
              searchDocs(e);
            }
          }}
          onChange={searchDocs}
        />
      </div>
    </div>
  );
};

export default SearchField;
