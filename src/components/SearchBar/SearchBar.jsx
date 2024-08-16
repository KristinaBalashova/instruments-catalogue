import React, { useState } from 'react';

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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        disabled={disabled}
      />
      <Button type="submit" children={strings.search} disabled={disabled} />
    </form>
  );
};

export default SearchBar;
