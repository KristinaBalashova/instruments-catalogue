import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { USER_MESSAGES } from '../../strings';
import { Button, Input } from '../';
import styles from './SearchBar.module.css';

const SearchBar = ({ setSearchQuery, disabled = false }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSearchQuery(query);
  };

  const handleClear = () => {
    setQuery('');
    setSearchQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputWrapper}>
        <Input
          type="text"
          placeholder={USER_MESSAGES.SEARCH}
          value={query}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {query && (
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
