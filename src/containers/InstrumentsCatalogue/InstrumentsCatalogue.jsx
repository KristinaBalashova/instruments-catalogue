import { useEffect, useState, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import { supabase } from '../../helpers/supabaseClient';
import { strings } from '../../strings';
import { ThemeContext } from '../../context/context';

import { getFiltersFromSearchParams } from '../../helpers/getFiltersFromSearchParams';
import useDeleteItem from '../../hooks/useDeleteItem';

import cx from 'classnames';

import {
  FiltersPanel,
  PaginationButtons,
  SearchBar,
  Loader,
  InstrumentsList,
  Modal,
  Button,
  StatusInfo,
} from '../../components';

import styles from './InstrumentsCatalogue.module.css';

const InstrumentsCatalogue = () => {
  const [searchParams] = useSearchParams();

  const { theme } = useContext(ThemeContext);

  const { deleteItem, errorDelete } = useDeleteItem();

  const [currentPage, setCurrentPage] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState('*');
  const [dataFilters, setDataFilters] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filtersObject = getFiltersFromSearchParams(searchParams);

  const { brand = '*', type = '*', country = '*' } = filtersObject;

  const itemsPerPage = 6;

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      let query = supabase
        .from('instruments_collection')
        .select('name, image, id', { count: 'exact' });

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

  const handleDeleteSuccess = useCallback((deletedId) => {
    setData((prevData) => prevData.filter((item) => item.id !== deletedId));
    setTotalItems((prevTotal) => prevTotal - 1);
  }, []);

  return (
    <section className={cx(styles.root, theme === 'dark' && styles.darkTheme)}>
      <div className={styles.container}>
        <SearchBar setSearchQuery={setSearchQuery} disabled={loading && true} />
        <div className={styles.dataContainer}>
          <div className={styles.filtersMobile}>
            <Button secondary onClick={() => setIsModalOpen(true)}>
              Filters
            </Button>
            {isModalOpen && (
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                appElement={document.getElementById('root') || undefined}
              >
                <FiltersPanel data={dataFilters} />
              </Modal>
            )}
          </div>
          <div className={styles.filtersDesktop}>
            <FiltersPanel data={dataFilters} />
          </div>

          {loading && <Loader />}
          {!loading && totalItems === 0 && <StatusInfo>{strings.nothingFound}</StatusInfo>}
          <div className={styles.cardsContainer}>
            <InstrumentsList
              data={data}
              deleteItem={deleteItem}
              errorDelete={errorDelete}
              onDeleteSuccess={handleDeleteSuccess}
            />
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
