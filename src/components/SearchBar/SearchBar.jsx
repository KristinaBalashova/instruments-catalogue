import React, { useState, useEffect } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { USER_MESSAGES } from '../../strings';
import { Button, Input } from '../';
import styles from './SearchBar.module.css';
import { setQuery, deleteQuery } from '../../helpers/changeQuery';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = ({ disabled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize queryInput with the current search query from the URL
  const [queryInput, setQueryInput] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });

  const handleInputChange = (event) => {
    setQueryInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setQuery('search', queryInput, location, navigate);
  };

  const handleClear = () => {
    setQueryInput('');
    deleteQuery('search', location, navigate);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.container}>
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