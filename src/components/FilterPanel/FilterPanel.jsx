import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './FiltersPanel.module.css';
import Button from '../Button/Button';

const FiltersPanel = ({ dataFilters }) => {
  const location = useLocation();
  const navigateTo = useNavigate();

  // Update the URL's searchParams when filters change
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const searchParams = new URLSearchParams(location.search);

    if (value === '*') {
      searchParams.delete(name); // Remove filter if it's set to "All"
    } else {
      searchParams.set(name, value); // Set the filter value in the URL
    }

    searchParams.set('page', 0); // Reset to the first page on filter change

    navigateTo(`?${searchParams.toString()}`);
  };

  // Clear all filters
  const handleFilterClear = () => {
    const searchParams = new URLSearchParams(location.search);

    Object.keys(dataFilters).forEach((filter) => {
      searchParams.delete(filter); // Remove all filters
    });

    searchParams.set('page', 0); // Reset to the first page

    navigateTo(`?${searchParams.toString()}`);
  };

  return (
    <div className={styles.filterContainer}>
      {Object.keys(dataFilters).map((filter) => (
        <form key={filter} className={styles.form}>
          <label className={styles.label}>{filter}</label>
          <select
            id={filter}
            name={filter}
            onChange={handleFilterChange}
            className={styles.select}
            value={new URLSearchParams(location.search).get(filter) || '*'} // Set the current filter value from URL
          >
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
