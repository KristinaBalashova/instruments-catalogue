import React, { useState, useEffect } from 'react';
import styles from './FiltersPanel.module.css';
import Button from '../Button/Button';

const FiltersPanel = ({ setFilters, dataFilters }) => {
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterClear = () => {
    setFilters((prevFilters) => ({
      ...Object.keys(dataFilters).reduce((acc, filter) => {
        acc[filter] = '*';
        return acc;
      }, {}),
    }));
  };

  return (
    <div className={styles.filterContainer}>
      {Object.keys(dataFilters).map((filter) => (
        <form key={filter} className={styles.form}>
          <label className={styles.label}>{filter}</label>
          <select id={filter} name={filter} onChange={handleFilterChange} className={styles.select}>
            <option value={'*'}>{'All'}</option>
            {dataFilters[filter] &&
              dataFilters[filter].map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
          </select>
        </form>
      ))}
      <Button secondary onClick={handleFilterClear}>
        Clear filters
      </Button>
    </div>
  );
};

export default FiltersPanel;
