import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { USER_MESSAGES } from '../../strings';
import { Button, Input } from '../';
import styles from './SearchBar.module.css';
import { setQuery, deleteQuery } from '../../helpers/changeQuery';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = ({ setSearchQuery, disabled = false }) => {
  const [queryInput, setQueryInput] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setQueryInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setQuery('search', queryInput, location, navigate);
    setSearchQuery(queryInput);
  };

  const handleClear = () => {
    setQueryInput(''); 
    deleteQuery('search', location, navigate); 
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <Input
          type="text"
          placeholder={USER_MESSAGES.SEARCH}
          value={queryInput}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {queryInput && (
          <RxCross2 className={styles.clearIcon} onClick={handleClear} aria-label="Clear search" />
        )}
      </div>
      <Button type="submit" disabled={disabled}>
        {USER_MESSAGES.SEARCH}
      </Button>
    </form>
  );
};

export default SearchBar;