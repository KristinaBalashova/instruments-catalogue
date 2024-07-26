import React, { useState, useEffect } from 'react';
import styles from './FiltersPanel.module.css';
import { supabase } from '../../supabaseClient';
import Button from '../Button/Button';

const FiltersPanel = ({ setFilters }) => {
  const [dataFilters, setDataFilters] = useState({});

  useEffect(() => {
    const fetchDataForFiltering = async () => {
      const { data, error } = await supabase.from('instruments_collection').select('*');

      if (error) {
        console.error('Error fetching data for filters:', error);
      } else {
        const uniqueFilters = listOfFilters.reduce((acc, filter) => {
          acc[filter] = [...new Set(data.map((item) => item[filter]))];
          return acc;
        }, {});
        setDataFilters(uniqueFilters);
      }
    };

    fetchDataForFiltering();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterClear = () => {
    setFilters((prevFilters) => ({
      ...listOfFilters.reduce((acc, filter) => {
        acc[filter] = '*';
        return acc;
      }, {}),
    }));
  };
  const listOfFilters = ['brand', 'type', 'country', 'materials'];

  return (
    <div className={styles.filterContainer}>
      {listOfFilters.map((filter) => (
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
