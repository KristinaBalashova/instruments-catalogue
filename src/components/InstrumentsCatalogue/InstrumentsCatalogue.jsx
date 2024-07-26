import styles from './InstrumentsCatalogue.module.css';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import InstrumentCard from '../InstrumentCard/InstrumentCard';
import FiltersPanel from '../FilterForm/FilterForm';
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

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let { data, error, count } = await supabase
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
    };

    fetchData();
  }, [currentPage, searchQuery, filters, totalItems]);

  return (
    <section className={styles.root}>
      <div className={styles.container}>
        {<SearchBar setSearchQuery={setSearchQuery} />}
        <div className={styles.itemsContainer}>
          <FiltersPanel setFilters={setFilters} />

          {loading && <Loader />}
          {!totalItems && <div>Sorry, nothing found</div>}
          {
            <div className={styles.cardsContainer}>
              <div className={styles.cards}>
                {data &&
                  data.map((item) => {
                    return <InstrumentCard key={item.id} instrumentData={item} />;
                  })}
              </div>
              {totalItems ? (
                <PaginationButtons
                  currentPage={currentPage}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  setCurrentPage={setCurrentPage}
                />
              ) : null}
            </div>
          }
        </div>
      </div>
    </section>
  );
};

export default InstrumentsCatalogue;
