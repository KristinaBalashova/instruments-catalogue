import styles from './InstrumentsCatalogue.module.css';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import InstrumentCard from '../InstrumentCard/InstrumentCard';
import FiltersPanel from '../FilterPanel/FilterPanel';
import PaginationButtons from '../PaginationButtons/PaginationButtons';
import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';

const InstrumentsCatalogue = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('*');

  const [filters, setFilters] = useState({
    brand: '*',
    type: '*',
    country: '*',
    materials: '*',
  });

  const [dataFilters, setDataFilters] = useState({});
  const itemsPerPage = 4;

  const listOfFilters = useMemo(() => ['brand', 'type', 'country', 'materials'], []);

  // Fetch filters data only once
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
  }, [listOfFilters]);

  // Memoized fetch data function
  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data, error, count } = await supabase
      .from('instruments_collection')
      .select('*', { count: 'exact' })
      .ilike('brand', filters.brand)
      .ilike('type', filters.type)
      .ilike('country', filters.country)
      .ilike('materials', filters.materials)
      .ilike('name', `%${searchQuery}%`)
      .range(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage - 1);

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setData(data);
      setTotalItems(count);
    }

    setLoading(false);
  }, [currentPage, searchQuery, filters]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        <SearchBar setSearchQuery={setSearchQuery} />
        <div className={styles.itemsContainer}>
          <FiltersPanel setFilters={setFilters} dataFilters={dataFilters} />
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
