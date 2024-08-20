import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import { strings } from '../../strings';

import Button from '../Button/Button';
import Input from '../Input/Input';

import styles from './SearchBar.module.css';

const SearchBar = ({ setSearchQuery, placeholder = 'Search...', disabled = false }) => {
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
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          disabled={disabled}
        />
        {query && (
          <RxCross2 className={styles.clearIcon} onClick={handleClear} aria-label="Clear search" />
        )}
      </div>
      <Button type="submit" disabled={disabled}>
        {strings.search}
      </Button>
    </form>
  );
};

export default SearchBar;
