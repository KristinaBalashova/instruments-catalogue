import styles from './InstrumentsCatalogue.module.css';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import InstrumentCard from '../InstrumentCard/InstrumentCard';
import FiltersPanel from '../FilterForm/FilterForm';
import PaginationButtons from '../PaginationButtons/PaginationButtons';
import SearchBar from '../SearchBar/SearchBar';

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
  });

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchTotalItems = async () => {
      const { count, error } = await supabase
        .from('instruments-collection')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total items count:', error);
      } else {
        setTotalItems(count);
      }
    };

    fetchTotalItems();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let { data, error } = await supabase
        .from('instruments-collection')
        .select('*')
        //.textSearch('name', 'nova') //use array search, transform name to arr and search contains
        .ilike('brand', filters.brand)
        .ilike('type', filters.type)
        .ilike('country', filters.country)
        .range(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage - 1);

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setData(data);
      }
      setLoading(false);
    };

    fetchData();
  }, [currentPage, searchQuery, filters]);

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        {<SearchBar setSearchQuery={setSearchQuery} />}
        <div className={styles.itemsContainer}>
          <FiltersPanel setFilters={setFilters} />

          {loading && <div>Loading...</div>}
          {
            <div className={styles.cardsContainer}>
              <div className={styles.cards}>
                {data &&
                  data.map((item) => {
                    return <InstrumentCard key={item.id} instrumentData={item} />;
                  })}
              </div>

              <PaginationButtons
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          }
        </div>
      </div>
    </section>
  );
};

export default InstrumentsCatalogue;
