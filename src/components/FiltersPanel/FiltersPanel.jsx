import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { strings } from '../../strings';
import { Button } from '../';
import styles from './FiltersPanel.module.css';

const FiltersPanel = ({ data }) => {
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
            <option value={'*'}>{strings.all}</option>
            {data[filter] &&
              data[filter].map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
          </select>
        </form>
      ))}
      <Button secondary onClick={handleFilterClear}>
        {strings.clearFilters}
      </Button>
    </div>
  );
};

export default FiltersPanel;
