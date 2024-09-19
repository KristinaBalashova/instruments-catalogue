import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { GoSearch } from 'react-icons/go';
import { USER_MESSAGES } from '../../strings';
import { Input } from '../';
import styles from './SearchBar.module.css';
import { setQuery, deleteQuery } from '../../helpers/changeQuery';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = ({ disabled = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [queryInput, setQueryInput] = useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });

  const handleInputChange = (event) => {
    setQueryInput(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (queryInput) {
      {
        console.log('button renders with input');
      }
      setQuery('search', queryInput, location, navigate);
    }
  };

  const handleClear = () => {
    setQueryInput('');
    deleteQuery('search', location, navigate);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <button className={styles.searchButton} type="submit" aria-label="Search">
            <GoSearch />
          </button>
          <input
            type="text"
            placeholder={USER_MESSAGES.SEARCH}
            value={queryInput}
            onChange={handleInputChange}
            disabled={disabled}
            className={styles.input}
          />
        </div>

        {queryInput && (
          <button className={styles.clearButton} onClick={handleClear} aria-label="Clear search">
            <RxCross2 />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
