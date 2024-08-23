import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { USER_MESSAGES } from '../../strings';
import { Button } from '../';
import styles from './FiltersPanel.module.css';

const FiltersPanel = ({ data, clearButton = true }) => {
  const location = useLocation();
  const navigateTo = useNavigate();

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const searchParams = new URLSearchParams(location.search);

    if (value === '*') {
      searchParams.delete(name);
    } else {
      searchParams.set(name, value);
    }

    searchParams.set('page', 0);

    navigateTo(`?${searchParams.toString()}`);
  };

  const handleFilterClear = () => {
    const searchParams = new URLSearchParams(location.search);
    Object.keys(data).forEach((filter) => {
      searchParams.delete(filter);
    });
    searchParams.set('page', 0);
    navigateTo(`?${searchParams.toString()}`);
  };

  return (
    <div className={styles.filterContainer}>
      {Object.keys(data).map((filter) => (
        <form key={filter} className={styles.form}>
          <label className={styles.label}>{filter}</label>
          <select
            id={filter}
            name={filter}
            onChange={handleFilterChange}
            className={styles.select}
            value={new URLSearchParams(location.search).get(filter) || '*'}
          >
            <option value={'*'}>{USER_MESSAGES.ALL}</option>
            {data[filter] &&
              data[filter].map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
          </select>
        </form>
      ))}
      {clearButton && (
        <Button secondary onClick={handleFilterClear} className={styles.button}>
          {USER_MESSAGES.CLEAR_FILTERS}
        </Button>
      )}
    </div>
  );
};

export default FiltersPanel;
