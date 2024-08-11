import styles from './InstrumentsCatalogue.module.css';
import React, { useEffect, useState, useContext } from 'react';
import { supabase } from '../../supabaseClient';
import InstrumentCard from '../InstrumentCard/InstrumentCard';
import FiltersPanel from '../FilterPanel/FilterPanel';
import PaginationButtons from '../PaginationButtons/PaginationButtons';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import { ThemeContext } from '../../context/context';
import cx from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { getFiltersFromSearchParams } from '../../assets/getFiltersFromSearchParams';

const InstrumentsCatalogue = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('*');
  const { theme } = useContext(ThemeContext);
  const [filters, setFilters] = useState({
    brand: '*',
    type: '*',
    country: '*',
    materials: '*',
  });
  const [searchParams] = useSearchParams();
  const [dataFilters, setDataFilters] = useState({});

  const filtersObject = getFiltersFromSearchParams(searchParams);
  const { brand = '*', type = '*', country = '*' } = filtersObject;

  const itemsPerPage = 4;

  const listOfFilters = ['brand', 'type', 'country'];

  // Fetching all available filters
  useEffect(() => {
    const fetchDataForFiltering = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('instruments_collection')
        .select('*');

      if (error) {
        console.error('Error fetching data for filters:', error);
      } else {
        const uniqueFilters = listOfFilters.reduce((acc, filter) => {
          acc[filter] = [...new Set(data.map((item) => item[filter]))];
          return acc;
        }, {});
        setDataFilters(uniqueFilters);
      }
      setLoading(false);
    };

    fetchDataForFiltering();
  }, []);

  // Fetching data with applied filters and search
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let query = supabase
        .from('instruments_collection')
        .select('*', { count: 'exact' });

      // Apply filters
      if (brand !== '*') query = query.ilike('brand', brand);
      if (type !== '*') query = query.ilike('type', type);
      if (country !== '*') query = query.ilike('country', country);
      if (searchQuery !== '*') query = query.ilike('name', `%${searchQuery}%`);

      const { data, error, count } = await query.range(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage - 1);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data);
        setTotalItems(count);
      }

      setLoading(false);
    };

    fetchData();
  }, [currentPage, searchQuery, brand, type, country]);

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <SearchBar setSearchQuery={setSearchQuery} />
        <div className={styles.itemsContainer}>
          <FiltersPanel dataFilters={dataFilters} />
          {loading && <Loader />}
          {!loading && totalItems === 0 && <div>Sorry, nothing found</div>}
          <div className={styles.cardsContainer}>
            <div className={styles.cards}>
              {data.map((item) => (
                <InstrumentCard key={item.id} instrumentData={item} />
              ))}
            </div>
            {totalItems > itemsPerPage && (
              <PaginationButtons
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstrumentsCatalogue;