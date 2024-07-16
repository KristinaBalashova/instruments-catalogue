import React, { useState } from 'react';
import styles from './SearchBar.module.css';
import Button from '../Button/Button';

const SearchBar = ({ setSearchQuery, placeholder = 'Search...' }) => {
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
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
      />
      <Button type="submit" children="Search" />
    </form>
  );
};

export default SearchBar;
