import styles from './InstrumentsCatalogue.module.css';
import React, { useEffect, useState, useContext, useCallback } from 'react';
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
import useDeleteItem from '../../hooks/useDeleteItem';
import { strings } from '../../strings';
import { UserContext } from '../../context/context';

const InstrumentsCatalogue = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('*');
  const { theme } = useContext(ThemeContext);
  const [searchParams] = useSearchParams();
  const [dataFilters, setDataFilters] = useState({});
  const { deleteItem, statusDelete, errorDelete } = useDeleteItem();
  const { user } = useContext(UserContext);

  const filtersObject = getFiltersFromSearchParams(searchParams);
  const { brand = '*', type = '*', country = '*' } = filtersObject;

  const itemsPerPage = 4;

  const listOfFilters = ['brand', 'type', 'country'];

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('instruments_collection').select('*');

      if (error) {
        console.error(strings.errors.fethingData, error);
      } else {
        const uniqueFilters = listOfFilters.reduce((acc, filter) => {
          acc[filter] = [...new Set(data.map((item) => item[filter]))];
          return acc;
        }, {});
        setDataFilters(uniqueFilters);
      }
      setLoading(false);
    };

    fetchAllData();
  }, []);

  const handleDeleteSuccess = useCallback((deletedId) => {
    setData((prevData) => prevData.filter((item) => item.id !== deletedId));
    setTotalItems((prevTotal) => prevTotal - 1);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let query = supabase.from('instruments_collection').select('*', { count: 'exact' });

      if (brand !== '*') query = query.ilike('brand', brand);
      if (type !== '*') query = query.ilike('type', type);
      if (country !== '*') query = query.ilike('country', country);

      const { data, error, count } = await query
        .ilike('name', `%${searchQuery}%`)
        .range(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage - 1);

      if (error) {
        console.error(strings.errors.fethingData, error);
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
        <SearchBar setSearchQuery={setSearchQuery} disabled={loading && true} />
        <div className={styles.itemsContainer}>
          <FiltersPanel dataFilters={dataFilters} />
          {loading && <Loader />}
          {!loading && totalItems === 0 && <div>{strings.nothingFound}</div>}
          <div className={styles.cardsContainer}>
            <div className={styles.cards}>
              {data.map((item) => (
                <InstrumentCard
                  key={item.id}
                  instrumentData={item}
                  onDelete={() =>
                    deleteItem('instruments_collection', item.id, handleDeleteSuccess)
                  }
                  statusDelete={statusDelete}
                  errorDelete={errorDelete}
                  isAdim={user === 'admin' ? true : false}
                />
              ))}
            </div>
            <PaginationButtons
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              setCurrentPage={setCurrentPage}
              isVisible={totalItems > itemsPerPage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstrumentsCatalogue;
